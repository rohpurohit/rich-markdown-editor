"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_commands_1 = require("prosemirror-commands");
const isMarkActive_1 = __importDefault(require("../queries/isMarkActive"));
function removeMarks(view, marks) {
    marks.forEach((mark) => {
        if (isMarkActive_1.default(mark)(view.state)) {
            prosemirror_commands_1.toggleMark(mark)(view.state, view.dispatch);
        }
    });
}
exports.default = removeMarks;
//# sourceMappingURL=removeMarks.js.map