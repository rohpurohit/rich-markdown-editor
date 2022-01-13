import { liftListItem } from "prosemirror-schema-list";
import { canSplit } from "prosemirror-transform";

// copied from prosemirror-schema-list,
// to try to fix lifting item when pressing Enter on empty nested list item
export const customSplitListItem = (itemType) => {
  return function(state, dispatch) {
    const { $from, $to, node } = state.selection;
    if ((node && node.isBlock) || $from.depth < 2 || !$from.sameParent($to)) {
      return false;
    }

    const grandParent = $from.node(-1);
    if (grandParent.type !== itemType) {
      return false;
    }

    if (
      $from.parent.content.size === 0 &&
      $from.node(-1).childCount === $from.indexAfter(-1)
    ) {
      // In an empty block. lift the list item
      return liftListItem(itemType)(state, dispatch);
    }

    const nextType =
      $to.pos === $from.end()
        ? grandParent.contentMatchAt(0).defaultType
        : null;
    const tr = state.tr.delete($from.pos, $to.pos);
    const types = nextType && [null, { type: nextType }];
    if (!canSplit(tr.doc, $from.pos, 2, types)) {
      return false;
    }
    if (dispatch) dispatch(tr.split($from.pos, 2, types).scrollIntoView());
    return true;
  };
};
