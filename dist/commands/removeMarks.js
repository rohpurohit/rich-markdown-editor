"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const isMarkActive_1 = __importDefault(require("../queries/isMarkActive"));
function removeMarks(view, marks) {
    const { state } = view;
    const { tr, selection: { from, to }, } = state;
    tr.setStoredMarks([]);
    marks
        .filter((mark) => isMarkActive_1.default(mark)(state))
        .forEach((mark) => tr.removeMark(from, to, mark));
    view.dispatch(tr);
}
exports.default = removeMarks;
//# sourceMappingURL=removeMarks.js.map