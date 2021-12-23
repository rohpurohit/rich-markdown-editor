import { InputRule, wrappingInputRule } from "prosemirror-inputrules";
import { canJoin, findWrapping } from "prosemirror-transform";
import toggleList from "../commands/toggleList";
import Node from "./Node";

export default class BulletList extends Node {
  get name() {
    return "bullet_list";
  }

  get schema() {
    return {
      content: "list_item+",
      group: "block",
      parseDOM: [{ tag: "ul" }],
      toDOM: () => ["ul", 0],
    };
  }

  commands({ type, schema }) {
    return () => toggleList(type, schema.nodes.list_item);
  }

  keys({ type, schema }) {
    return {
      "Shift-Ctrl-8": toggleList(type, schema.nodes.list_item),
    };
  }

  inputRules({ type }) {
    return [
      wrappingInputRule(/^\s*([-+*])\s$/, type),

      // below is a custom added rule to create bullet list by default (like remnote)
      //TODO: more testing for this rule to make sure it is working as expected.
      new InputRule(
        /^[\s\t\f]*[a-z,A-Z,0-9]?$/,
        (state, [matchStr], start, end) => {
          const tr = !matchStr.trim()
            ? state.tr.delete(start, end)
            : state.tr.insertText(matchStr, start, end);

          const $start = tr.doc.resolve(start);
          const range = $start.blockRange();
          const wrapping = range && findWrapping(range, type);

          if (!wrapping) return null;
          tr.wrap(range, wrapping);

          const before = tr.doc.resolve(start - 1).nodeBefore;
          if (before && before.type == type && canJoin(tr.doc, start - 1))
            tr.join(start - 1);

          return tr;
        }
      ),
    ];
  }

  toMarkdown(state, node) {
    state.renderList(node, "  ", () => (node.attrs.bullet || "*") + " ");
  }

  parseMarkdown() {
    return { block: "bullet_list" };
  }
}
