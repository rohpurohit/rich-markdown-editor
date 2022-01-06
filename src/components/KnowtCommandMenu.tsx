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
import insertFiles from "../commands/insertFiles";
import baseDictionary from "../dictionary";
import { getStyleValue } from "../domHelpers";

const SSR = typeof window === "undefined";

const defaultMenuPosition: MenuPosition = {
  left: -1000,
  top: 0,
  bottom: undefined,
};

export type Props = {
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
    item: MenuItem,
    index: number,
    callback: (ref: HTMLDivElement) => void,
    options: {
      selected: boolean;
      isSearch: boolean;
      onClick: () => void;
    }
  ) => React.ReactNode;
  renderGroupMenuItem: (
    item: GroupMenuItem,
    index: number,
    callback: (ref: HTMLDivElement) => void,
    options: {
      selected: boolean;
      onClick: () => void;
    }
  ) => React.ReactNode;
  filterable?: boolean;
  allGroups: GroupMenuItem[];
  visibleGroups: GroupMenuItem[];
  id?: string;
};

type State = {
  insertItem?: EmbedDescriptor;
  selectedIndex: number;
  nestedSelectedIndex: number | null;
  searchItemsSelectedIndex: number;
  menu1Position: MenuPosition;
  menu2Position: MenuPosition;
  nestedMenuOpen: boolean;
};

class KnowtCommandMenu extends React.Component<Props, State> {
  menuRef = React.createRef<HTMLDivElement>();
  listRef = React.createRef<HTMLOListElement>();
  inputRef = React.createRef<HTMLInputElement>();
  menuTitleRef = React.createRef<HTMLDivElement>();

  primaryItemsRef: HTMLDivElement[] = [];

  state: State = {
    menu1Position: defaultMenuPosition,
    menu2Position: defaultMenuPosition,
    selectedIndex: 0,
    nestedSelectedIndex: null,
    searchItemsSelectedIndex: 0,
    insertItem: undefined,
    nestedMenuOpen: false,
  };

  constructor(props: Props) {
    super(props);
  }

  // register keyDown event
  componentDidMount(): void {
    if (!SSR) {
      window.addEventListener("keydown", this.handleKeyDown);
    }
  }

  // standard optimization stuff
  shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
    return (
      nextProps.search !== this.props.search ||
      nextProps.isActive !== this.props.isActive ||
      nextState !== this.state
    );
  }

  // calculate new positioning if needed, and reset state
  componentDidUpdate(prevProps: Props): void {
    if (
      (this.props.isActive && !prevProps.isActive) ||
      (this.props.search && this.props.search !== prevProps.search)
    ) {
      // menu became active, or search term has changed
      // -> reset selection state and find the new pos
      this.setState({
        insertItem: undefined,
        selectedIndex: 0,
        searchItemsSelectedIndex: 0,
        menu1Position: this.calculateMenu1Position(),
      });
    }

    if (prevProps.isActive && !this.props.isActive) {
      // menu became inactive -> update the state accordingly
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

    const stateKey = this.props.search
      ? "searchItemsSelectedIndex"
      : this.state.nestedSelectedIndex === null
      ? "selectedIndex"
      : "nestedSelectedIndex";

    const currentArray =
      stateKey === "searchItemsSelectedIndex"
        ? this.filtered.map(({ items }) => items).flat()
        : stateKey === "nestedSelectedIndex"
        ? this.filtered[this.state.selectedIndex].items
        : this.filtered;

    const currentIndex = this.state[stateKey] ?? 0;

    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();

      const item = currentArray[currentIndex];

      if (item) {
        if (stateKey === "selectedIndex") {
          this.onGroupSelect(this.state.selectedIndex);
        } else {
          this.insertItem(item as MenuItem);
        }
      } else {
        this.props.onClose();
      }
    }

    const isUpKey =
      e.key === "ArrowUp" ||
      (e.key === "Tab" && e.shiftKey) ||
      (e.ctrlKey && e.key === "p");

    const isDownKey =
      e.key === "ArrowDown" ||
      (e.key === "Tab" && !e.shiftKey) ||
      (e.ctrlKey && e.key === "n");

    if (isUpKey || isDownKey) {
      e.preventDefault();
      e.stopPropagation();

      const newIndex = isUpKey
        ? currentIndex - 1 < 0
          ? currentArray.length - 1
          : currentIndex - 1
        : currentIndex + 1 === currentArray.length
        ? 0
        : currentIndex + 1;

      if (currentArray.length) {
        if (stateKey === "searchItemsSelectedIndex") {
          this.setState({ searchItemsSelectedIndex: newIndex });
        } else if (stateKey === "nestedSelectedIndex") {
          this.setState({ nestedSelectedIndex: newIndex });
        } else {
          let updatedState = { selectedIndex: newIndex };
          if (this.state.nestedMenuOpen) {
            // update nested menu position
            updatedState = Object.assign(updatedState, {
              menu2Position: this.calculateMenu2Position(newIndex),
            });
          }
          this.setState(updatedState);
        }
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
  insertItem = (item: MenuItem | EmbedDescriptor): void => {
    switch (item.name) {
      case "image":
        return this.triggerImagePick();
      case "embed":
        return this.triggerLinkInput(item as EmbedDescriptor);
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
      selectedIndex: 0,
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
    this.setState({
      selectedIndex: index,
      nestedSelectedIndex: 0,
      nestedMenuOpen: true,
      menu2Position: this.calculateMenu2Position(index),
    });
  }

  calculateMenu2Position(groupIndex: number): MenuPosition {
    const [SAFE_MARGIN_X, SAFE_MARGIN_Y] = [10, 50];
    const menuHeight = this.getMenu2Height(groupIndex);

    const { right, top: _top } = this.primaryItemsRef[
      groupIndex
    ].getBoundingClientRect();

    const bottomToBottomDistance =
      window.innerHeight - (_top + menuHeight + SAFE_MARGIN_Y);
    const left = right + window.scrollX + SAFE_MARGIN_X;

    const offset = bottomToBottomDistance > 0 ? 0 : bottomToBottomDistance;

    return {
      left,
      top: _top + window.scrollY + offset,
      bottom: undefined,
    };
  }

  calculateMenu1Position(): MenuPosition {
    if (this.props.search) {
      // the menu is already opened, update its position
      return this.getSearchMenuPosition();
    }

    return this.getMenu1InitialPosition();
  }

  getSearchMenuPosition(): MenuPosition {
    if (this.filtered.length === 0) {
      return this.state.menu1Position;
    }

    const searchMenuHeight = this.getSearchMenuHeight();
    console.log(searchMenuHeight);

    return this.state.menu1Position;
  }

  getMenu1InitialPosition(): MenuPosition {
    const { view, isActive, rtl } = this.props;
    const { selection } = view.state;
    let startPos;

    try {
      startPos = view.coordsAtPos(selection.from);
    } catch (err) {
      console.warn(err);
      return defaultMenuPosition;
    }

    const menuRef = this.menuRef.current;
    const menuHeight = menuRef ? menuRef.offsetHeight : 0;

    const paragraph: { node: any } = {
      node: findDomRefAtPos(selection.from, view.domAtPos.bind(view)),
    };

    if (
      !isActive ||
      !paragraph.node ||
      !paragraph.node.getBoundingClientRect ||
      SSR
    ) {
      return defaultMenuPosition;
    }

    const { top, bottom, right } = paragraph.node.getBoundingClientRect();
    const left =
      rtl && menuRef
        ? right - menuRef.scrollWidth
        : this.getCaretPosition().left + window.scrollX;

    const SAFE_MARGIN_Y = 60;

    if (startPos.top + menuHeight + SAFE_MARGIN_Y < window.innerHeight) {
      return {
        left,
        top: bottom + window.scrollY,
        bottom: undefined,
        isAbove: true,
      };
    } else {
      return {
        left,
        top: undefined,
        bottom: window.innerHeight - top - window.scrollY,
        isAbove: false,
      };
    }
  }

  getMenu2Height(groupIndex: number): number {
    const contentHeight = this.getGroupHeight(this.filtered[groupIndex]);
    const menuPaddingY =
      getStyleValue(this.listRef.current, "paddingBlock") * 2;

    return contentHeight + menuPaddingY;
  }

  getSearchMenuHeight(): number {
    let searchMenuHeight = 0;
    searchMenuHeight +=
      getStyleValue(this.listRef.current, "rowGap") *
      (this.filtered.length - 1);
    searchMenuHeight += getStyleValue(this.listRef.current, "paddingBlock") * 2;

    return this.filtered.reduce(
      (acc, group) => (acc += this.getGroupHeight(group)),
      searchMenuHeight
    );
  }

  getGroupHeight(group: GroupMenuItem): number {
    const titleHeight = this.menuTitleRef.current?.offsetHeight || 0;
    const itemsHeight =
      group.items.length * (this.primaryItemsRef[0]?.offsetHeight || 0);

    return titleHeight + itemsHeight;
  }

  get filtered(): GroupMenuItem[] {
    if (!this.props.search) {
      return this.props.visibleGroups;
    }

    // now that we're searching, filter based on this.props.allGroups,
    // taking into account items with `defaultHidden: true`
    return this.props.allGroups
      .map((group) => {
        const filteredItems = group.items.filter(
          ({ name, title, keywords, mainKeyword }) => {
            if (!this.props.filterable) return true;

            // Some extensions may be disabled, remove corresponding menu items
            if (
              name &&
              !this.props.commands[name] &&
              !this.props.commands[`create${capitalize(name)}`]
            ) {
              return false;
            }

            // If no image upload callback has been passed, filter the image block out
            if (!this.props.uploadImage && name === "image") return false;

            return [
              group.groupData.name,
              title,
              keywords,
              mainKeyword,
            ].some((str) =>
              str?.toLowerCase().includes(this.props.search?.toLowerCase())
            );
          }
        );

        return {
          ...group,
          items: filteredItems,
        };
      })
      .filter(({ items }) => items.length);
  }

  renderGroups(): React.ReactNode {
    // only show the groups of this.props.visibleGroups,
    // that will exclude items with `defaultHidden: true`
    return this.filtered.map((item, index) => {
      return this.props.renderGroupMenuItem(
        item,
        index,
        (node) => {
          this.primaryItemsRef[index] = node;
        },
        {
          selected: index === this.state.selectedIndex && this.props.isActive,
          onClick: () => this.onGroupSelect(index),
        }
      );
    });
  }

  renderSearchResults(): React.ReactNode {
    let currentIndex = 0;
    return this.filtered.map((group) => {
      return (
        <div key={group.groupData.name}>
          <MenuTitle>{group.groupData.name}</MenuTitle>
          {group.items.map((item, index) => {
            const itemIndex = currentIndex++;
            return this.props.renderMenuItem(
              item,
              index,
              (node) => {
                this.primaryItemsRef[itemIndex] = node;
              },
              {
                selected: itemIndex === this.state.searchItemsSelectedIndex,
                isSearch: true,
                onClick: () => this.insertItem(item),
              }
            );
          })}
        </div>
      );
    });
  }

  // renders a link input if we're in link input mode (ex: youtube link)
  // otherwise renders a list of items...
  // also renders a file input element if we provided an `uploadImage` prop
  render() {
    const { dictionary, isActive, uploadImage } = this.props;
    const selectedGroup = this.filtered[this.state.selectedIndex];

    return (
      <Portal>
        <Wrapper
          id={this.props.id || "block-menu-container"}
          active={isActive}
          ref={this.menuRef}
          {...this.state.menu1Position}
        >
          {this.state.insertItem ? (
            <LinkInputWrapper>
              <LinkInput
                type="text"
                placeholder={
                  this.state.insertItem.title
                    ? dictionary.pasteLinkWithTitle(this.state.insertItem.title)
                    : dictionary.pasteLink
                }
                onKeyDown={this.handleLinkInputKeydown}
                onPaste={this.handleLinkInputPaste}
                autoFocus
              />
            </LinkInputWrapper>
          ) : (
            <List
              ref={this.listRef}
              style={{ rowGap: this.props.search ? 8 : 0 }}
            >
              {this.props.search
                ? this.renderSearchResults()
                : this.renderGroups()}
              {this.props.search && this.filtered.length === 0 && (
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
          {...this.state.menu2Position}
        >
          <List>
            <MenuTitle ref={this.menuTitleRef}>
              {selectedGroup?.groupData.name}
            </MenuTitle>
            {selectedGroup?.items?.map((item, index) => {
              return this.props.renderMenuItem(item, index, () => {}, {
                selected: this.state.nestedSelectedIndex === index,
                isSearch: false,
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

const MenuTitle = styled.div`
  color: ${(props) => props.theme.placeholder};
  padding: 12px 0 20px 18px;
  font-family: Arial;
  font-size: 14px;
  font-weight: 600;
`;

const LinkInputWrapper = styled.div`
  margin: 8px;
`;

const LinkInput = styled(Input)`
  height: 36px;
  width: 100%;
  color: ${(props) => props.theme.blockToolbarText};
`;

const List = styled.ol`
  display: flex;
  flex-direction: column;
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
  isAbove?: boolean;
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
  transform: scale(
    ${({ isAbove }) => (typeof isAbove === "boolean" ? 0.95 : 1)}
  );
  transition: opacity 150ms cubic-bezier(0.175, 0.885, 0.32, 1.275),
    transform 150ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transition-delay: 150ms;
  line-height: 0;
  box-sizing: border-box;
  pointer-events: none;
  white-space: nowrap;
  min-width: 185px;
  max-height: 520px;
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

  ${({ active }) =>
    active &&
    `
    pointer-events: all;
    opacity: 1;
    `};

  ${({ isAbove }) =>
    typeof isAbove === "boolean" &&
    `
    transform: translateY(${isAbove ? "6px" : "-6px"}) scale(1);
  `}

  @media print {
    display: none;
  }
`;

export default KnowtCommandMenu;
