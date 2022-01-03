import * as React from "react";
import capitalize from "lodash/capitalize";
import { Portal } from "react-portal";
import { EditorView } from "prosemirror-view";
import { findDomRefAtPos, findParentNode } from "prosemirror-utils";
import styled from "styled-components";
import {
  EmbedDescriptor,
  MenuItem,
  ToastType,
  MenuPosition,
  GroupMenuItem,
} from "../types";
import Input from "./Input";
import VisuallyHidden from "./VisuallyHidden";
import getDataTransferFiles from "../lib/getDataTransferFiles";
import filterExcessSeparators from "../lib/filterExcessSeparators";
import insertFiles from "../commands/insertFiles";
import baseDictionary from "../dictionary";

const SSR = typeof window === "undefined";

const defaultMenuPosition: MenuPosition = {
  left: -1000,
  top: 0,
  bottom: undefined,
  isAbove: false,
};

export type Props<T extends MenuItem = MenuItem> = {
  rtl: boolean;
  isActive: boolean;
  commands: Record<string, any>;
  dictionary: typeof baseDictionary;
  view: EditorView;
  search: string;
  uploadImage?: (file: File) => Promise<string>;
  onImageUploadStart?: () => void;
  onImageUploadStop?: () => void;
  onShowToast?: (message: string, id: string) => void;
  onLinkToolbarOpen?: () => void;
  onClose: () => void;
  onClearSearch: () => void;
  embeds?: EmbedDescriptor[];
  renderMenuItem: (
    item: T,
    index: number,
    options: {
      selected: boolean;
      onClick: () => void;
    }
  ) => React.ReactNode;
  renderGroupMenuItem: (
    item: GroupMenuItem<T>,
    index: number,
    callback: (ref: HTMLDivElement) => void,
    options: {
      selected: boolean;
      onClick: () => void;
    }
  ) => React.ReactNode;
  filterable?: boolean;
  items: T[];
  groupedItems: GroupMenuItem<T>[];
  id?: string;
};

type State = {
  insertItem?: EmbedDescriptor;
  selectedIndex: number;
  nestedSelectedIndex: number | null;
  menu1Position: MenuPosition;
  menu2Position: MenuPosition;
  nestedMenuOpen: boolean;
  activeNestedItems: MenuItem[];
};

class KnowtCommandMenu<T = MenuItem> extends React.Component<Props<T>, State> {
  menuRef = React.createRef<HTMLDivElement>();
  nestedMenuRef = React.createRef<HTMLDivElement>();
  inputRef = React.createRef<HTMLInputElement>();

  groupItemsRef: HTMLDivElement[] = [];

  state: State = {
    menu1Position: defaultMenuPosition,
    menu2Position: defaultMenuPosition,
    selectedIndex: 0,
    nestedSelectedIndex: null,
    insertItem: undefined,
    nestedMenuOpen: false,
    activeNestedItems: [],
  };

  constructor(props: Props<T>) {
    super(props);
  }

  // register keyDown event
  componentDidMount(): void {
    if (!SSR) {
      window.addEventListener("keydown", this.handleKeyDown);
    }
  }

  // standard optimization stuff
  shouldComponentUpdate(nextProps: Props<T>, nextState: State): boolean {
    return (
      nextProps.search !== this.props.search ||
      nextProps.isActive !== this.props.isActive ||
      nextState !== this.state
    );
  }

  // calculate new positioning if needed, and reset state
  componentDidUpdate(prevProps: Props<T>): void {
    if (!prevProps.isActive && this.props.isActive) {
      this.setState({
        insertItem: undefined,
        selectedIndex: 0,
        menu1Position: this.calculatePosition(this.props),
      });
    } else if (prevProps.search !== this.props.search) {
      this.setState({ selectedIndex: 0 });
    }

    if (prevProps.isActive && !this.props.isActive) {
      this.closeNestedMenu();
    }
  }

  // remove keyDown listener
  componentWillUnmount(): void {
    if (!SSR) {
      window.removeEventListener("keydown", this.handleKeyDown);
    }
  }

  // on Enter, calls insertItem with the current Item
  // on up/down arrows, changes selectedIndex / close if not items
  handleKeyDown = (e: KeyboardEvent): void => {
    if (!this.props.isActive) return;

    const stateKey =
      this.state.nestedSelectedIndex === null
        ? "selectedIndex"
        : "nestedSelectedIndex";

    const currentGroup = this.filtered[this.state.selectedIndex];
    const currentArray =
      stateKey === "nestedSelectedIndex" ? currentGroup.items : this.filtered;

    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();

      const item = currentArray[this.state[stateKey]];

      if (item) {
        if (stateKey === "nestedSelectedIndex") {
          this.insertItem(item);
        } else {
          this.onGroupSelect(this.state.selectedIndex);
        }
      } else {
        this.props.onClose();
      }
    }

    if (
      e.key === "ArrowUp" ||
      (e.key === "Tab" && e.shiftKey) ||
      (e.ctrlKey && e.key === "p")
    ) {
      e.preventDefault();
      e.stopPropagation();

      if (currentArray.length) {
        this.setState({
          [stateKey]: Math.max(0, this.state[stateKey] - 1),
        });
      } else {
        this.close();
      }
    }

    if (
      e.key === "ArrowDown" ||
      (e.key === "Tab" && !e.shiftKey) ||
      (e.ctrlKey && e.key === "n")
    ) {
      e.preventDefault();
      e.stopPropagation();

      if (currentArray.length) {
        this.setState({
          [stateKey]: Math.min(
            this.state[stateKey] + 1,
            currentArray.length - 1
          ),
        });
      } else {
        this.close();
      }
    }

    if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();

      this.setState({ nestedSelectedIndex: e.key === "ArrowRight" ? 0 : null });
    }

    if (e.key === "ArrowRight") {
      e.preventDefault();
      e.stopPropagation();

      this.setState({ nestedSelectedIndex: 0 });
    }

    if (e.key === "Escape") {
      this.close();
    }
  };

  // call an inserter function based on item.name (image, embed, link, or else)
  insertItem = (item: EmbedDescriptor): void => {
    switch (item.name) {
      case "image":
        return this.triggerImagePick();
      case "embed":
        return this.triggerLinkInput(item);
      case "link": {
        this.clearSearch();
        this.props.onClose();
        this.props.onLinkToolbarOpen?.();
        return;
      }
      default:
        this.insertBlock(item);
    }
  };

  close = (): void => {
    this.closeNestedMenu();
    this.props.onClose();
    this.props.view.focus();
  };

  closeNestedMenu(): void {
    this.setState({
      nestedMenuOpen: false,
      menu2Position: defaultMenuPosition,
      activeNestedItems: [],
      nestedSelectedIndex: null,
    });
  }

  // onEnter: check for valid link type (ex: youtube link), and insert the imbed component if so.
  // onEsc: close the menu
  handleLinkInputKeydown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (!this.props.isActive) return;
    if (!this.state.insertItem) return;

    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();

      const href = event.currentTarget.value;
      const matches = this.state.insertItem.matcher(href);

      if (!matches && this.props.onShowToast) {
        this.props.onShowToast(
          this.props.dictionary.embedInvalidLink,
          ToastType.Error
        );
        return;
      }

      this.insertBlock({
        name: "embed",
        attrs: {
          href,
        },
      });
    }

    if (event.key === "Escape") {
      this.props.onClose();
      this.props.view.focus();
    }
  };

  // will directly try to match (as pressing onEnter from handleLinkInputKeydown)
  handleLinkInputPaste = (
    event: React.ClipboardEvent<HTMLInputElement>
  ): void => {
    if (!this.props.isActive) return;
    if (!this.state.insertItem) return;

    const href = event.clipboardData.getData("text/plain");
    const matches = this.state.insertItem.matcher(href);

    if (matches) {
      event.preventDefault();
      event.stopPropagation();

      this.insertBlock({
        name: "embed",
        attrs: {
          href,
        },
      });
    }
  };

  // open the image picker
  triggerImagePick = (): void => {
    if (this.inputRef.current) {
      this.inputRef.current.click();
    }
  };

  // open the link input (ex: youtube link)
  triggerLinkInput = (item: EmbedDescriptor): void => {
    this.setState({ insertItem: item });
  };

  // get file metadata, and insert it at the parent pos,
  // using insertFilles, then close the menu
  handleImagePicked = (event): void => {
    const files = getDataTransferFiles(event);

    const {
      view,
      uploadImage,
      onImageUploadStart,
      onImageUploadStop,
      onShowToast,
    } = this.props;
    const { state } = view;
    const parent = findParentNode((node) => !!node)(state.selection);

    this.clearSearch();

    if (!uploadImage) {
      throw new Error("uploadImage prop is required to replace images");
    }

    if (parent) {
      insertFiles(view, event, parent.pos, files, {
        uploadImage,
        onImageUploadStart,
        onImageUploadStop,
        onShowToast,
        dictionary: this.props.dictionary,
      });
    }

    if (this.inputRef.current) {
      this.inputRef.current.value = "";
    }

    this.props.onClose();
  };

  // this.props.clearSearch()
  clearSearch = (): void => {
    this.props.onClearSearch();
  };

  // run a command by item.name, and close
  insertBlock(item): void {
    this.clearSearch();

    const command = this.props.commands[item.name];

    if (command) {
      command(item.attrs);
    } else {
      this.props.commands[`create${capitalize(item.name)}`](item.attrs);
    }

    this.props.onClose();
  }

  // returns getBoundingRect top/left of the current selection range
  getCaretPosition(): { top: number; left: number } {
    const selection = window.document.getSelection();
    if (!selection || !selection.anchorNode || !selection.focusNode) {
      return {
        top: 0,
        left: 0,
      };
    }

    const range = window.document.createRange();

    range.setStart(selection.anchorNode, selection.anchorOffset);
    range.setEnd(selection.focusNode, selection.focusOffset);

    // This is a workaround for an edgecase where getBoundingClientRect will
    // return zero values if the selection is collapsed at the start of a newline
    // see reference here: https://stackoverflow.com/a/59780954
    const rects = range.getClientRects();
    if (rects.length === 0) {
      // probably buggy newline behavior, explicitly select the node contents
      if (range.startContainer && range.collapsed) {
        range.selectNodeContents(range.startContainer);
      }
    }

    const rect = range.getBoundingClientRect();
    return {
      top: rect.top,
      left: rect.left,
    };
  }

  onGroupSelect(index: number): void {
    const nestedItems = this.props.groupedItems[index].items;
    const ref = this.groupItemsRef[index];

    const { right, top: _top } = ref.getBoundingClientRect();

    const menuHeight = nestedItems.length * 36 + 16;
    const marginV = 50;
    const marginH = 15;

    const top = _top + menuHeight + marginV < window.innerHeight ? _top : 0;
    const left = right + (window.scrollX ?? 0) + marginH;

    const menu2Position = {
      left,
      top,
      bottom: undefined,
      isAbove: true,
    };

    this.setState({
      nestedSelectedIndex: 0,
      selectedIndex: index,
      nestedMenuOpen: true,
      activeNestedItems: nestedItems,
      menu2Position,
    });
  }

  calculatePosition(props: Props<T>): MenuPosition {
    const { view } = props;
    const { selection } = view.state;
    let startPos;

    try {
      startPos = view.coordsAtPos(selection.from);
    } catch (err) {
      console.warn(err);
      return defaultMenuPosition;
    }

    const menuRef = this.menuRef.current;
    const offsetHeight = menuRef ? menuRef.offsetHeight : 0;

    const paragraph: { node: any } = {
      node: findDomRefAtPos(selection.from, view.domAtPos.bind(view)),
    };

    if (
      !props.isActive ||
      !paragraph.node ||
      !paragraph.node.getBoundingClientRect ||
      SSR
    ) {
      return defaultMenuPosition;
    }

    const { top, bottom, right } = paragraph.node.getBoundingClientRect();

    const left =
      props.rtl && menuRef
        ? right - menuRef.scrollWidth
        : this.getCaretPosition().left + window.scrollX;

    if (startPos.top - offsetHeight > 50) {
      return {
        left,
        top: undefined,
        bottom: window.innerHeight - top - window.scrollY,
        isAbove: false,
      };
    } else {
      return {
        left,
        top: bottom + window.scrollY,
        bottom: undefined,
        isAbove: true,
      };
    }
  }

  // filter items (search..) and add embeds
  get filtered(): GroupMenuItem[] {
    const {
      embeds = [],
      search = "",
      uploadImage,
      commands,
      filterable = true,
    } = this.props;

    return this.props.groupedItems;

    // const embedItems: EmbedDescriptor[] = [];

    // for (const embed of embeds) {
    //   if (embed.title && embed.icon) {
    //     embedItems.push({
    //       ...embed,
    //       name: "embed",
    //     });
    //   }
    // }

    // if (embedItems.length) {
    //   items.push({
    //     name: "separator",
    //   });
    //   items = items.concat(embedItems);
    // }

    // const filtered = items.filter((item) => {
    //   if (item.name === "separator") return true;

    //   // Some extensions may be disabled, remove corresponding menu items
    //   if (
    //     item.name &&
    //     !commands[item.name] &&
    //     !commands[`create${capitalize(item.name)}`]
    //   ) {
    //     return false;
    //   }

    //   // If no image upload callback has been passed, filter the image block out
    //   if (!uploadImage && item.name === "image") return false;

    //   // some items (defaultHidden) are not visible until a search query exists
    //   if (!search) return !item.defaultHidden;

    //   const n = search.toLowerCase();
    //   if (!filterable) {
    //     return item;
    //   }
    //   return (
    //     (item.title || "").toLowerCase().includes(n) ||
    //     (item.keywords || "").toLowerCase().includes(n)
    //   );
    // });

    const filtered = [];
    return filterExcessSeparators(filtered);
  }

  // renders a link input if we're in link input mode (ex: youtube link)
  // otherwise renders a list of items...
  // also renders a file input element if we provided an `uploadImage` prop
  render() {
    const { dictionary, isActive, uploadImage } = this.props;
    // const items = this.getFilterItems(this.props.items);
    const { insertItem, menu1Position, menu2Position } = this.state;

    return (
      <Portal>
        <Wrapper
          id={this.props.id || "block-menu-container"}
          active={isActive}
          ref={this.menuRef}
          {...menu1Position}
        >
          {insertItem ? (
            <LinkInputWrapper>
              <LinkInput
                type="text"
                placeholder={
                  insertItem.title
                    ? dictionary.pasteLinkWithTitle(insertItem.title)
                    : dictionary.pasteLink
                }
                onKeyDown={this.handleLinkInputKeydown}
                onPaste={this.handleLinkInputPaste}
                autoFocus
              />
            </LinkInputWrapper>
          ) : (
            <List>
              {this.props.search
                ? this.props.search
                : this.filtered.map((item, index) => {
                    return this.props.renderGroupMenuItem(
                      item,
                      index,
                      (node) => {
                        this.groupItemsRef[index] = node;
                      },
                      {
                        selected:
                          index === this.state.selectedIndex && isActive,
                        onClick: () => this.onGroupSelect(index),
                      }
                    );
                  })}
              {this.filtered.length === 0 && (
                <ListItem>
                  <Empty>{dictionary.noResults}</Empty>
                </ListItem>
              )}
            </List>
          )}
          {uploadImage && (
            <VisuallyHidden>
              <input
                type="file"
                ref={this.inputRef}
                onChange={this.handleImagePicked}
                accept="image/*"
              />
            </VisuallyHidden>
          )}
        </Wrapper>
        <Wrapper
          id={"block-menu-container-2"}
          active={this.state.nestedMenuOpen}
          ref={this.nestedMenuRef}
          {...menu2Position}
        >
          <List>
            {this.state.activeNestedItems.map((item, index) => {
              return this.props.renderMenuItem(item, index, {
                selected: this.state.nestedSelectedIndex === index,
                onClick: () => this.insertItem(item),
              });
            })}
            {this.filtered.length === 0 && (
              <ListItem>
                <Empty>{dictionary.noResults}</Empty>
              </ListItem>
            )}
          </List>
        </Wrapper>
      </Portal>
    );
  }
}

const LinkInputWrapper = styled.div`
  margin: 8px;
`;

const LinkInput = styled(Input)`
  height: 36px;
  width: 100%;
  color: ${(props) => props.theme.blockToolbarText};
`;

const List = styled.ol`
  list-style: none;
  text-align: left;
  height: 100%;
  padding: 12px 0;
  margin: 0;
`;

const ListItem = styled.li`
  padding: 0;
  margin: 0;
`;

const Empty = styled.div`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.textSecondary};
  font-weight: 500;
  font-size: 14px;
  height: 36px;
  padding: 0 16px;
`;

export const Wrapper = styled.div<{
  active: boolean;
  top?: number;
  bottom?: number;
  left?: number;
  isAbove: boolean;
}>`
  color: ${(props) => props.theme.text};
  font-family: ${(props) => props.theme.fontFamilyMono};
  position: absolute;
  z-index: ${(props) => props.theme.zIndex + 100};
  ${(props) => props.top !== undefined && `top: ${props.top}px`};
  ${(props) => props.bottom !== undefined && `bottom: ${props.bottom}px`};
  left: ${(props) => props.left}px;
  background-color: ${(props) => props.theme.blockToolbarBackground};
  border-radius: 14px;
  box-shadow: rgb(0 0 0 / 8%) 0px 0.4rem 1.6rem 0px;
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 150ms cubic-bezier(0.175, 0.885, 0.32, 1.275),
    transform 150ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transition-delay: 150ms;
  line-height: 0;
  box-sizing: border-box;
  pointer-events: none;
  white-space: nowrap;
  min-width: 180px;
  max-height: 300px;
  overflow: hidden;
  overflow-y: auto;
  * {
    box-sizing: border-box;
  }

  &::-webkit-scrollbar {
    background: transparent;
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 30px;
    background-color: rgba(220, 220, 220, 0.6);
  }

  hr {
    border: 0;
    height: 0;
    margin: 0;
    border-top: 1px solid ${(props) => props.theme.blockToolbarDivider};
  }

  ${({ active, isAbove }) =>
    active &&
    `
    transform: translateY(${isAbove ? "6px" : "-6px"}) scale(1);
    pointer-events: all;
    opacity: 1;
  `};

  @media print {
    display: none;
  }
`;

export default KnowtCommandMenu;
