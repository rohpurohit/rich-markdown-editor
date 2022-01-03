"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wrapper = void 0;
const React = __importStar(require("react"));
const capitalize_1 = __importDefault(require("lodash/capitalize"));
const react_portal_1 = require("react-portal");
const prosemirror_utils_1 = require("prosemirror-utils");
const styled_components_1 = __importDefault(require("styled-components"));
const types_1 = require("../types");
const Input_1 = __importDefault(require("./Input"));
const VisuallyHidden_1 = __importDefault(require("./VisuallyHidden"));
const getDataTransferFiles_1 = __importDefault(require("../lib/getDataTransferFiles"));
const filterExcessSeparators_1 = __importDefault(require("../lib/filterExcessSeparators"));
const insertFiles_1 = __importDefault(require("../commands/insertFiles"));
const SSR = typeof window === "undefined";
const defaultMenuPosition = {
    left: -1000,
    top: 0,
    bottom: undefined,
    isAbove: false,
};
class KnowtCommandMenu extends React.Component {
    constructor(props) {
        super(props);
        this.menuRef = React.createRef();
        this.nestedMenuRef = React.createRef();
        this.inputRef = React.createRef();
        this.groupItemsRef = [];
        this.state = {
            menu1Position: defaultMenuPosition,
            menu2Position: defaultMenuPosition,
            selectedIndex: 0,
            nestedSelectedIndex: null,
            insertItem: undefined,
            nestedMenuOpen: false,
            activeGroup: null,
        };
        this.handleKeyDown = (e) => {
            if (!this.props.isActive)
                return;
            const stateKey = this.state.nestedSelectedIndex === null
                ? "selectedIndex"
                : "nestedSelectedIndex";
            const currentGroup = this.filtered[this.state.selectedIndex];
            const currentArray = stateKey === "nestedSelectedIndex" ? currentGroup.items : this.filtered;
            if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                const item = currentArray[this.state[stateKey]];
                if (item) {
                    if (stateKey === "nestedSelectedIndex") {
                        this.insertItem(item);
                    }
                    else {
                        this.onGroupSelect(this.state.selectedIndex);
                    }
                }
                else {
                    this.props.onClose();
                }
            }
            if (e.key === "ArrowUp" ||
                (e.key === "Tab" && e.shiftKey) ||
                (e.ctrlKey && e.key === "p")) {
                e.preventDefault();
                e.stopPropagation();
                if (currentArray.length) {
                    this.setState({
                        [stateKey]: Math.max(0, this.state[stateKey] - 1),
                    });
                }
                else {
                    this.close();
                }
            }
            if (e.key === "ArrowDown" ||
                (e.key === "Tab" && !e.shiftKey) ||
                (e.ctrlKey && e.key === "n")) {
                e.preventDefault();
                e.stopPropagation();
                if (currentArray.length) {
                    this.setState({
                        [stateKey]: Math.min(this.state[stateKey] + 1, currentArray.length - 1),
                    });
                }
                else {
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
        this.insertItem = (item) => {
            var _a, _b;
            switch (item.name) {
                case "image":
                    return this.triggerImagePick();
                case "embed":
                    return this.triggerLinkInput(item);
                case "link": {
                    this.clearSearch();
                    this.props.onClose();
                    (_b = (_a = this.props).onLinkToolbarOpen) === null || _b === void 0 ? void 0 : _b.call(_a);
                    return;
                }
                default:
                    this.insertBlock(item);
            }
        };
        this.close = () => {
            this.closeNestedMenu();
            this.props.onClose();
            this.props.view.focus();
        };
        this.handleLinkInputKeydown = (event) => {
            if (!this.props.isActive)
                return;
            if (!this.state.insertItem)
                return;
            if (event.key === "Enter") {
                event.preventDefault();
                event.stopPropagation();
                const href = event.currentTarget.value;
                const matches = this.state.insertItem.matcher(href);
                if (!matches && this.props.onShowToast) {
                    this.props.onShowToast(this.props.dictionary.embedInvalidLink, types_1.ToastType.Error);
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
        this.handleLinkInputPaste = (event) => {
            if (!this.props.isActive)
                return;
            if (!this.state.insertItem)
                return;
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
        this.triggerImagePick = () => {
            if (this.inputRef.current) {
                this.inputRef.current.click();
            }
        };
        this.triggerLinkInput = (item) => {
            this.setState({ insertItem: item });
        };
        this.handleImagePicked = (event) => {
            const files = getDataTransferFiles_1.default(event);
            const { view, uploadImage, onImageUploadStart, onImageUploadStop, onShowToast, } = this.props;
            const { state } = view;
            const parent = prosemirror_utils_1.findParentNode((node) => !!node)(state.selection);
            this.clearSearch();
            if (!uploadImage) {
                throw new Error("uploadImage prop is required to replace images");
            }
            if (parent) {
                insertFiles_1.default(view, event, parent.pos, files, {
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
        this.clearSearch = () => {
            this.props.onClearSearch();
        };
    }
    componentDidMount() {
        if (!SSR) {
            window.addEventListener("keydown", this.handleKeyDown);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.search !== this.props.search ||
            nextProps.isActive !== this.props.isActive ||
            nextState !== this.state);
    }
    componentDidUpdate(prevProps) {
        if (!prevProps.isActive && this.props.isActive) {
            this.setState({
                insertItem: undefined,
                selectedIndex: 0,
                menu1Position: this.calculatePosition(this.props),
            });
        }
        else if (prevProps.search !== this.props.search) {
            this.setState({ selectedIndex: 0 });
        }
        if (prevProps.isActive && !this.props.isActive) {
            this.closeNestedMenu();
        }
    }
    componentWillUnmount() {
        if (!SSR) {
            window.removeEventListener("keydown", this.handleKeyDown);
        }
    }
    closeNestedMenu() {
        this.setState({
            nestedMenuOpen: false,
            menu2Position: defaultMenuPosition,
            activeGroup: null,
            nestedSelectedIndex: null,
        });
    }
    insertBlock(item) {
        this.clearSearch();
        const command = this.props.commands[item.name];
        if (command) {
            command(item.attrs);
        }
        else {
            this.props.commands[`create${capitalize_1.default(item.name)}`](item.attrs);
        }
        this.props.onClose();
    }
    getCaretPosition() {
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
        const rects = range.getClientRects();
        if (rects.length === 0) {
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
    onGroupSelect(index) {
        var _a;
        const activeGroup = this.props.groupedItems[index];
        const ref = this.groupItemsRef[index];
        const { right, top: _top } = ref.getBoundingClientRect();
        const menuHeight = activeGroup.items.length * 36 + 16;
        const marginV = 50;
        const marginH = 15;
        const top = _top + menuHeight + marginV < window.innerHeight ? _top : 0;
        const left = right + ((_a = window.scrollX) !== null && _a !== void 0 ? _a : 0) + marginH;
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
            activeGroup,
            menu2Position,
        });
    }
    calculatePosition(props) {
        const { view } = props;
        const { selection } = view.state;
        let startPos;
        try {
            startPos = view.coordsAtPos(selection.from);
        }
        catch (err) {
            console.warn(err);
            return defaultMenuPosition;
        }
        const menuRef = this.menuRef.current;
        const offsetHeight = menuRef ? menuRef.offsetHeight : 0;
        const paragraph = {
            node: prosemirror_utils_1.findDomRefAtPos(selection.from, view.domAtPos.bind(view)),
        };
        if (!props.isActive ||
            !paragraph.node ||
            !paragraph.node.getBoundingClientRect ||
            SSR) {
            return defaultMenuPosition;
        }
        const { top, bottom, right } = paragraph.node.getBoundingClientRect();
        const left = props.rtl && menuRef
            ? right - menuRef.scrollWidth
            : this.getCaretPosition().left + window.scrollX;
        if (startPos.top - offsetHeight > 50) {
            return {
                left,
                top: undefined,
                bottom: window.innerHeight - top - window.scrollY,
                isAbove: false,
            };
        }
        else {
            return {
                left,
                top: bottom + window.scrollY,
                bottom: undefined,
                isAbove: true,
            };
        }
    }
    get filtered() {
        const { embeds = [], search = "", uploadImage, commands, filterable = true, } = this.props;
        return this.props.groupedItems;
        const filtered = [];
        return filterExcessSeparators_1.default(filtered);
    }
    render() {
        var _a, _b, _c;
        const { dictionary, isActive, uploadImage } = this.props;
        const { insertItem, menu1Position, menu2Position } = this.state;
        return (React.createElement(react_portal_1.Portal, null,
            React.createElement(exports.Wrapper, Object.assign({ id: this.props.id || "block-menu-container", active: isActive, ref: this.menuRef }, menu1Position),
                insertItem ? (React.createElement(LinkInputWrapper, null,
                    React.createElement(LinkInput, { type: "text", placeholder: insertItem.title
                            ? dictionary.pasteLinkWithTitle(insertItem.title)
                            : dictionary.pasteLink, onKeyDown: this.handleLinkInputKeydown, onPaste: this.handleLinkInputPaste, autoFocus: true }))) : (React.createElement(List, null,
                    this.props.search
                        ? this.props.search
                        : this.filtered.map((item, index) => {
                            return this.props.renderGroupMenuItem(item, index, (node) => {
                                this.groupItemsRef[index] = node;
                            }, {
                                selected: index === this.state.selectedIndex && isActive,
                                onClick: () => this.onGroupSelect(index),
                            });
                        }),
                    this.filtered.length === 0 && (React.createElement(ListItem, null,
                        React.createElement(Empty, null, dictionary.noResults))))),
                uploadImage && (React.createElement(VisuallyHidden_1.default, null,
                    React.createElement("input", { type: "file", ref: this.inputRef, onChange: this.handleImagePicked, accept: "image/*" })))),
            React.createElement(exports.Wrapper, Object.assign({ id: "block-menu-container-2", active: this.state.nestedMenuOpen, ref: this.nestedMenuRef }, menu2Position),
                React.createElement(List, null,
                    React.createElement(MenuTitle, null, (_a = this.state.activeGroup) === null || _a === void 0 ? void 0 : _a.groupData.name), (_c = (_b = this.state.activeGroup) === null || _b === void 0 ? void 0 : _b.items) === null || _c === void 0 ? void 0 :
                    _c.map((item, index) => {
                        return this.props.renderMenuItem(item, index, {
                            selected: this.state.nestedSelectedIndex === index,
                            onClick: () => this.insertItem(item),
                        });
                    }),
                    this.filtered.length === 0 && (React.createElement(ListItem, null,
                        React.createElement(Empty, null, dictionary.noResults)))))));
    }
}
const MenuTitle = styled_components_1.default.div `
  color: ${(props) => props.theme.placeholder};
  padding: 12px 0 20px 18px;
  font-family: Arial;
  font-size: 14px;
  font-weight: 600;
`;
const LinkInputWrapper = styled_components_1.default.div `
  margin: 8px;
`;
const LinkInput = styled_components_1.default(Input_1.default) `
  height: 36px;
  width: 100%;
  color: ${(props) => props.theme.blockToolbarText};
`;
const List = styled_components_1.default.ol `
  list-style: none;
  text-align: left;
  height: 100%;
  padding: 12px 0;
  margin: 0;
`;
const ListItem = styled_components_1.default.li `
  padding: 0;
  margin: 0;
`;
const Empty = styled_components_1.default.div `
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.textSecondary};
  font-weight: 500;
  font-size: 14px;
  height: 36px;
  padding: 0 16px;
`;
exports.Wrapper = styled_components_1.default.div `
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

  ${({ active, isAbove }) => active &&
    `
    transform: translateY(${isAbove ? "6px" : "-6px"}) scale(1);
    pointer-events: all;
    opacity: 1;
  `};

  @media print {
    display: none;
  }
`;
exports.default = KnowtCommandMenu;
//# sourceMappingURL=KnowtCommandMenu.js.map