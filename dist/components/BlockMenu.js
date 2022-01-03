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
const react_1 = __importDefault(require("react"));
const prosemirror_utils_1 = require("prosemirror-utils");
const KnowtCommandMenu_1 = __importDefault(require("./KnowtCommandMenu"));
const BlockMenuItem_1 = __importDefault(require("./BlockMenuItem"));
const BlockGroupMenuItem_1 = __importDefault(require("./BlockGroupMenuItem"));
const block_1 = __importStar(require("../menus/block"));
class BlockMenu extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.clearSearch = () => {
            const { state, dispatch } = this.props.view;
            const parent = prosemirror_utils_1.findParentNode((node) => !!node)(state.selection);
            if (parent) {
                dispatch(state.tr.insertText("", parent.pos, state.selection.to));
            }
        };
    }
    get items() {
        return block_1.default(this.props.dictionary);
    }
    get groupedItems() {
        return block_1.groupedBlockMenu(this.props.dictionary);
    }
    render() {
        return (react_1.default.createElement(KnowtCommandMenu_1.default, Object.assign({}, this.props, { filterable: true, onClearSearch: this.clearSearch, renderMenuItem: (item, _index, options) => {
                return (react_1.default.createElement(BlockMenuItem_1.default, { key: item.title, onClick: options.onClick, selected: options.selected, icon: item.icon, title: item.title, shortcut: item.shortcut }));
            }, renderGroupMenuItem: (item, _index, innerRef, options) => {
                return (react_1.default.createElement(BlockGroupMenuItem_1.default, { innerRef: innerRef, key: item.groupData.name, title: item.groupData.name, selected: options.selected, onClick: options.onClick }));
            }, items: this.items, groupedItems: this.groupedItems })));
    }
}
exports.default = BlockMenu;
//# sourceMappingURL=BlockMenu.js.map