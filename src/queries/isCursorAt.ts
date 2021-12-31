import { EditorState } from "prosemirror-state";

export default function isCursorAt(pos: number, state: EditorState): boolean {
  return state.selection.from === pos && state.selection.to === pos;
}
