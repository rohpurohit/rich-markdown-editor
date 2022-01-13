"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customSplitListItem = void 0;
const prosemirror_schema_list_1 = require("prosemirror-schema-list");
const prosemirror_transform_1 = require("prosemirror-transform");
const customSplitListItem = (itemType) => {
    return function (state, dispatch) {
        const { $from, $to, node } = state.selection;
        if ((node && node.isBlock) || $from.depth < 2 || !$from.sameParent($to)) {
            return false;
        }
        const grandParent = $from.node(-1);
        if (grandParent.type !== itemType) {
            return false;
        }
        if ($from.parent.content.size === 0 &&
            $from.node(-1).childCount === $from.indexAfter(-1)) {
            return prosemirror_schema_list_1.liftListItem(itemType)(state, dispatch);
        }
        const nextType = $to.pos === $from.end()
            ? grandParent.contentMatchAt(0).defaultType
            : null;
        const tr = state.tr.delete($from.pos, $to.pos);
        const types = nextType && [null, { type: nextType }];
        if (!prosemirror_transform_1.canSplit(tr.doc, $from.pos, 2, types)) {
            return false;
        }
        if (dispatch)
            dispatch(tr.split($from.pos, 2, types).scrollIntoView());
        return true;
    };
};
exports.customSplitListItem = customSplitListItem;
//# sourceMappingURL=customSplitListItem.js.map