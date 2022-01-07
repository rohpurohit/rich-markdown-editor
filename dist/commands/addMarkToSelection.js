"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function addMarkToSelection(type, attrs = {}) {
    return (state, dispatch) => {
        dispatch(state.tr.addMark(state.selection.from, state.selection.to, type.create(attrs)));
        return true;
    };
}
exports.default = addMarkToSelection;
//# sourceMappingURL=addMarkToSelection.js.map