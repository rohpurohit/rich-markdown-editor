import { toggleMark } from "prosemirror-commands";
import markInputRule from "../../lib/markInputRule";
import Mark from "../Mark";
import markRule from "../../rules/mark";

export default class DefaultHighlight extends Mark {
  get name() {
    return "highlight_default";
  }

  get schema() {
    return {
      parseDOM: [
        {
          tag: "mark",
        },
        {
          style: "background-color",
          getAttrs: (value) => !!value && value !== "transparent",
        },
      ],
      toDOM: () => ["mark", { class: "red" }],
    };
  }

  inputRules({ type }) {
    return [markInputRule(/(?:==)([^=]+)(?:==)$/, type)];
  }

  commands({ type }) {
    return () => toggleMark(type);
  }

  get rulePlugins() {
    return [markRule({ delim: "==", mark: "highlight_default" })];
  }

  get toMarkdown() {
    return {
      open: "==",
      close: "==",
      mixable: true,
      expelEnclosingWhitespace: true,
    };
  }

  parseMarkdown() {
    return { mark: "highlight_default" };
  }
}
