import {
  Plugin,
  Selection,
  AllSelection,
  TextSelection,
} from "prosemirror-state";
import { GapCursor } from "prosemirror-gapcursor";
import Extension from "../lib/Extension";
import isModKey from "../lib/isModKey";
import isEmptyDoc from "../queries/isEmptyDoc";
export default class Keys extends Extension {
  get name() {
    return "keys";
  }

  get plugins() {
    return [
      new Plugin({
        props: {
          handleDOMEvents: {
            blur: this.options.onBlur,
            focus: this.options.onFocus,
          },
          // we can't use the keys bindings for this as we want to preventDefault
          // on the original keyboard event when handled
          handleKeyDown: ({ state, dispatch }, event) => {
            if (state.selection instanceof AllSelection) {
              if (event.key === "ArrowUp") {
                const selection = Selection.atStart(state.doc);
                dispatch(state.tr.setSelection(selection));
                return true;
              }
              if (event.key === "ArrowDown") {
                const selection = Selection.atEnd(state.doc);
                dispatch(state.tr.setSelection(selection));
                return true;
              }
            }

            // edge case where horizontal gap cursor does nothing if Enter key
            // is pressed. Insert a newline and then move the cursor into it.
            if (state.selection instanceof GapCursor) {
              if (event.key === "Enter") {
                dispatch(
                  state.tr.insert(
                    state.selection.from,
                    state.schema.nodes.paragraph.create({})
                  )
                );
                dispatch(
                  state.tr.setSelection(
                    TextSelection.near(
                      state.doc.resolve(state.selection.from),
                      -1
                    )
                  )
                );
                return true;
              }
            }

            if (["Backspace", "ArrowLeft", "ArrowUp"].includes(event.key)) {
              if (
                state.selection.from === 1 &&
                state.selection.to === 1 &&
                state.doc.content.firstChild?.type.name === "paragraph"
              ) {
                // if the cursor is at the start of the document
                // and we're in a paragraph (i.e, not in a special node like Heading)
                event.preventDefault();
                this.options.onGoToPreviousInput();
                return true;
              }

              return false;
            }

            // All the following keys require mod to be down
            if (!isModKey(event)) {
              return false;
            }

            if (event.key === "s") {
              event.preventDefault();
              this.options.onSave();
              return true;
            }

            if (event.key === "Enter") {
              event.preventDefault();
              this.options.onSaveAndExit();
              return true;
            }

            if (event.key === "Escape") {
              event.preventDefault();
              this.options.onCancel();
              return true;
            }

            return false;
          },
        },
      }),
    ];
  }
}
