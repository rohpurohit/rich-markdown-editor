import { toggleMark } from "prosemirror-commands";
import { MarkType } from "prosemirror-model";
import { EditorView } from "prosemirror-view";
import isMarkActive from "../queries/isMarkActive";

export default function removeMarks(view: EditorView, marks: MarkType[]): void {
  // for each mark type, check if it is active, if so, remove it..
  // check isMarkActive for more details on where the mark is active.
  marks.forEach((mark) => {
    if (isMarkActive(mark)(view.state)) {
      toggleMark(mark)(view.state, view.dispatch);
    }
  });
}
