"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircleIcon = void 0;
const react_1 = __importDefault(require("react"));
const outline_icons_1 = require("outline-icons");
const CircleIcon = ({ color, size, }) => {
    console.log(size);
    return (react_1.default.createElement(outline_icons_1.Icon, { color: color, size: size },
        react_1.default.createElement("circle", { fill: color, cx: size / 2, cy: size / 2, r: size / 2 })));
};
exports.CircleIcon = CircleIcon;
//# sourceMappingURL=icons.js.map