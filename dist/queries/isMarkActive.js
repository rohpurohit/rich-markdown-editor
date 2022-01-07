"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAnyMarkActive = void 0;
const isMarkActive = (type) => (state) => {
    if (!type) {
        return false;
    }
    const { from, $from, to, empty } = state.selection;
    return empty
        ? type.isInSet(state.storedMarks || $from.marks())
        : state.doc.rangeHasMark(from, to, type);
};
const isAnyMarkActive = (types) => (state) => {
    if (!Array.isArray(types)) {
        return false;
    }
    return types.some((type) => isMarkActive(type)(state));
};
exports.isAnyMarkActive = isAnyMarkActive;
exports.default = isMarkActive;
//# sourceMappingURL=isMarkActive.js.map