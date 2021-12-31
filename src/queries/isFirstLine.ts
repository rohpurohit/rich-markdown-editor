import { EditorView } from "prosemirror-view";

export default function isFirstLine(view: EditorView): boolean {
  const THRESHOLD = 57;
  // no science behind this number, just testing..
  // the number is big because we're taking into account the case where the cursor in inside an H1

  return view.coordsAtPos(view.state.selection.$from.pos).top < THRESHOLD;
}
