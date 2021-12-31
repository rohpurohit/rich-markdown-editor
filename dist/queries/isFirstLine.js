"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const THRESHOLD = 57;
function isFirstLine(editor, view) {
    if (!editor.element) {
        throw new Error("Editor element is not defined -- cannot determine if cursor is on first line");
    }
    const parentTop = editor.element.getBoundingClientRect().top;
    const selectionTop = view.coordsAtPos(view.state.selection.$from.pos).top;
    return selectionTop - parentTop < THRESHOLD;
}
exports.default = isFirstLine;
//# sourceMappingURL=isFirstLine.js.map