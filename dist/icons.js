"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveIcon = exports.CircleIcon = void 0;
const react_1 = __importDefault(require("react"));
const outline_icons_1 = require("outline-icons");
const CircleIcon = (_a) => {
    var { color, size } = _a, rest = __rest(_a, ["color", "size"]);
    return (react_1.default.createElement(outline_icons_1.Icon, { color: color, size: size },
        react_1.default.createElement("circle", Object.assign({}, rest))));
};
exports.CircleIcon = CircleIcon;
const RemoveIcon = ({ color, size, }) => (react_1.default.createElement(outline_icons_1.Icon, { color: color, size: size },
    react_1.default.createElement("svg", { height: "20px", version: "1.1", viewBox: "0 0 20 20", width: "20px" },
        react_1.default.createElement("title", null),
        react_1.default.createElement("desc", null),
        react_1.default.createElement("defs", null),
        react_1.default.createElement("g", { fill: "none", fillRule: "evenodd", id: "Page-1", stroke: "none", strokeWidth: "1" },
            react_1.default.createElement("g", { fill: color, id: "Core", transform: "translate(-2.000000, -380.000000)" },
                react_1.default.createElement("g", { id: "remove-circle-outline", transform: "translate(2.000000, 380.000000)" },
                    react_1.default.createElement("path", { d: "M5,9 L5,11 L15,11 L15,9 L5,9 L5,9 Z M10,0 C4.5,0 0,4.5 0,10 C0,15.5 4.5,20 10,20 C15.5,20 20,15.5 20,10 C20,4.5 15.5,0 10,0 L10,0 Z M10,18 C5.6,18 2,14.4 2,10 C2,5.6 5.6,2 10,2 C14.4,2 18,5.6 18,10 C18,14.4 14.4,18 10,18 L10,18 Z", id: "Shape" })))))));
exports.RemoveIcon = RemoveIcon;
//# sourceMappingURL=icons.js.map