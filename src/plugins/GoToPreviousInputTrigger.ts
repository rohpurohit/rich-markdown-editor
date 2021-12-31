import { Plugin } from "prosemirror-state";
import Extension from "../lib/Extension";
import isCursorAt from "../queries/isCursorAt";
import isFirstLine from "../queries/isFirstLine";
import isInList from "../queries/isInList";

export default class GoToPreviousInputTrigger extends Extension {
  get name() {
    return "goto_previous_input";
  }

  get plugins() {
    return [
      new Plugin({
        props: {
          handleKeyDown: (view, event) => {
            if (
              event.key === "Backspace" &&
              isCursorAt(1, view.state) &&
              view.state.doc.content.firstChild?.type.name === "paragraph" // if there is another node type, we should let prosemirror handle it and remove this node
            ) {
              event.preventDefault();
              this.options.onGoToPreviousInput();
              return true;
            }

            if (event.key === "ArrowUp" && isFirstLine(view)) {
              event.preventDefault();
              this.options.onGoToPreviousInput();
              return true;
            }

            if (event.key === "ArrowLeft" && isFirstLine(view)) {
              if (
                (isCursorAt(3, view.state) && isInList(view)) || // the cursor will be at pos 3 if the list is empty
                isCursorAt(1, view.state)
              ) {
                event.preventDefault();
                this.options.onGoToPreviousInput();
                return true;
              }
            }

            return false;
          },
        },
      }),
    ];
  }
}
