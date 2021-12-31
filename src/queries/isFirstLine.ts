import { EditorView } from "prosemirror-view";
import RichMarkdownEditor from "..";

const THRESHOLD = 24;
// no science behind this number, just testing..
// 24px is the case when the cursor is inside a H1 tag

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

  return selectionTop - parentTop <= THRESHOLD;
}
