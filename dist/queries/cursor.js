"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCursorAt = void 0;
const isCursorAt = (pos, state) => {
    return state.selection.from === pos && state.selection.to === pos;
};
exports.isCursorAt = isCursorAt;
//# sourceMappingURL=cursor.js.map