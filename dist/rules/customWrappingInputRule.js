"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customWrappingInputRule = void 0;
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
const prosemirror_transform_1 = require("prosemirror-transform");
function customWrappingInputRule(regexp, nodeType, getAttrs, joinPredicate, preserveMatchedRule) {
    return new prosemirror_inputrules_1.InputRule(regexp, (state, match, start, end) => {
        const attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;
        const tr = state.tr;
        const $start = tr.doc.resolve(start), range = $start.blockRange(), wrapping = range && prosemirror_transform_1.findWrapping(range, nodeType, attrs);
        if (!wrapping)
            return null;
        tr.wrap(range, wrapping);
        const before = tr.doc.resolve(start - 1).nodeBefore;
        if (before &&
            before.type === nodeType &&
            prosemirror_transform_1.canJoin(tr.doc, start - 1) &&
            (!joinPredicate || joinPredicate(match, before)))
            tr.join(start - 1);
        return tr;
    });
}
exports.customWrappingInputRule = customWrappingInputRule;
//# sourceMappingURL=customWrappingInputRule.js.map