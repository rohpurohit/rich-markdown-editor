"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isCursorAt(pos, state) {
    return state.selection.from === pos && state.selection.to === pos;
}
exports.default = isCursorAt;
//# sourceMappingURL=isCursorAt.js.map