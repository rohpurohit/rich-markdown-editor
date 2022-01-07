import { EditorState } from "prosemirror-state";

const isMarkActive = (type) => (state: EditorState): boolean => {
  if (!type) {
    return false;
  }

  const { from, $from, to, empty } = state.selection;

  console.log(empty, $from.marks()?.[0]?.type?.name, $from.pos, to);

  return empty
    ? type.isInSet(state.storedMarks || $from.marks())
    : state.doc.rangeHasMark(from, to, type);
};

export const isAnyMarkActive = (types: any[]) => (
  state: EditorState
): boolean => {
  if (!Array.isArray(types)) {
    return false;
  }

  return types.some((type) => isMarkActive(type)(state));
};

export default isMarkActive;
