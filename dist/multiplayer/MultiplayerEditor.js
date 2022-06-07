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
const Y = __importStar(require("yjs"));
const __1 = __importDefault(require(".."));
const MultiplayerExtension_1 = __importDefault(require("./MultiplayerExtension"));
const y_websocket_1 = require("y-websocket");
const MultiplayerEditor = () => {
    const ydoc = new Y.Doc();
    const provider = new y_websocket_1.WebsocketProvider("wss://demos.yjs.dev", "prosemirror-demo", ydoc);
    const extensions = [
        new MultiplayerExtension_1.default({
            user: "1",
            provider: provider,
            document: ydoc,
        }),
    ];
    return react_1.default.createElement(__1.default, { extensions: extensions });
};
exports.default = MultiplayerEditor;
//# sourceMappingURL=MultiplayerEditor.js.map