import { EditorView } from "prosemirror-view";
import RichMarkdownEditor from "..";

const THRESHOLD = 57;
// no science behind this number, just testing..
// the number is big because we're taking into account the case where the cursor in inside an H1

export default function isFirstLine(
  editor: RichMarkdownEditor,
  view: EditorView
): boolean {
  if (!editor.element) {
    throw new Error(
      "Editor element is not defined -- cannot determine if cursor is on first line"
    );
  }

  const parentTop = editor.element.getBoundingClientRect().top;
  const selectionTop = view.coordsAtPos(view.state.selection.$from.pos).top;

  return selectionTop - parentTop < THRESHOLD;
}
