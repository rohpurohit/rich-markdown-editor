"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isFirstLine(view) {
    const THRESHOLD = 57;
    return view.coordsAtPos(view.state.selection.$from.pos).top < THRESHOLD;
}
exports.default = isFirstLine;
//# sourceMappingURL=isFirstLine.js.map