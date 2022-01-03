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
const React = __importStar(require("react"));
const smooth_scroll_into_view_if_needed_1 = __importDefault(require("smooth-scroll-into-view-if-needed"));
const styled_components_1 = __importStar(require("styled-components"));
const right_arrow_png_1 = __importDefault(require("../assets/right-arrow.png"));
function BlockGroupMenuItem(props) {
    const { title, selected, disabled = false, onClick, containerId = "block-menu-container", innerRef, } = props;
    const ref = React.useCallback((node) => {
        innerRef(node);
        if (selected && node) {
            smooth_scroll_into_view_if_needed_1.default(node, {
                scrollMode: "if-needed",
                block: "center",
                boundary: (parent) => {
                    return parent.id !== containerId;
                },
            });
        }
    }, [selected, containerId, innerRef]);
    return (React.createElement(MenuItem, { selected: selected, onClick: disabled ? undefined : onClick, ref: ref },
        title,
        React.createElement(Circle, null,
            React.createElement(Icon, { src: right_arrow_png_1.default }))));
}
const MenuItem = styled_components_1.default.button `
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;
  font-size: 14px;
  line-height: 1;
  width: 100%;
  height: 36px;
  cursor: pointer;
  border: none;
  opacity: ${(props) => (props.disabled ? ".5" : "1")};
  color: ${(props) => props.selected
    ? props.theme.blockToolbarTextSelected
    : props.theme.blockToolbarText};
  background: ${(props) => props.selected
    ? props.theme.blockToolbarSelectedBackground ||
        props.theme.blockToolbarTrigger
    : "none"};
  padding: 0 16px;
  outline: none;

  &:hover,
  &:active {
    color: ${(props) => props.theme.blockToolbarTextSelected};
    background: ${(props) => props.selected
    ? props.theme.blockToolbarSelectedBackground ||
        props.theme.blockToolbarTrigger
    : props.theme.blockToolbarHoverBackground};
  }
`;
const CIRCLE_RADIUS = 20;
const ICON_DIMENSIONS = 15;
const Circle = styled_components_1.default.div `
  display: flex;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  width: ${CIRCLE_RADIUS}px;
  height: ${CIRCLE_RADIUS}px;
  min-width: ${CIRCLE_RADIUS}px;
  max-width: ${CIRCLE_RADIUS}px;
  min-height: ${CIRCLE_RADIUS}px;
  max-height: ${CIRCLE_RADIUS}px;
  border: 1px solid ${(props) => props.theme.blockToolbarDivider};
`;
const Icon = styled_components_1.default.img `
  width: ${ICON_DIMENSIONS}px;
  height: ${ICON_DIMENSIONS}px;
`;
exports.default = styled_components_1.withTheme(BlockGroupMenuItem);
//# sourceMappingURL=BlockGroupMenuItem.js.map