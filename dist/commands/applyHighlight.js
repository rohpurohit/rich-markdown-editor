"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_commands_1 = require("prosemirror-commands");
const addMarkToSelection_1 = __importDefault(require("./addMarkToSelection"));
function applyHighlight(type) {
    return (state, dispatch) => {
        if (state.selection.empty) {
            return prosemirror_commands_1.toggleMark(type)(state, dispatch);
        }
        return addMarkToSelection_1.default(type)(state, dispatch);
    };
}
exports.default = applyHighlight;
//# sourceMappingURL=applyHighlight.js.map