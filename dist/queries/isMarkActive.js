"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAnyMarkActive = void 0;
const isMarkActive = (type) => (state) => {
    var _a, _b, _c;
    if (!type) {
        return false;
    }
    const { from, $from, to, empty } = state.selection;
    console.log(empty, (_c = (_b = (_a = $from.marks()) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.type) === null || _c === void 0 ? void 0 : _c.name, $from.pos, to);
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