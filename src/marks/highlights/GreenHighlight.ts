import { toggleMark } from "prosemirror-commands";
import markInputRule from "../../lib/markInputRule";
import Mark from "../Mark";
import markRule from "../../rules/mark";

export default class GreenHighlight extends Mark {
  get name() {
    return "highlight_green";
  }

  get schema() {
    return {
      parseDOM: [
        {
          tag: "mark",
          getAttrs: (node) => node.getAttribute("class") === "green",
        },
        {
          style: "background-color",
          getAttrs: (value) => !!value && value === "green",
        },
      ],
      toDOM: () => ["mark", { class: "green" }],
    };
  }

  inputRules({ type }) {
    return [markInputRule(/(?:%%)([^=]+)(?:%%)$/, type)];
  }

  keys({ type }) {
    return {
      //   "Mod-Ctrl-h": toggleMark(type),
    };
  }

  commands({ type }) {
    return () => toggleMark(type);
  }

  get rulePlugins() {
    return [markRule({ delim: "%%", mark: "highlight_green" })];
  }

  get toMarkdown() {
    return {
      open: "%%",
      close: "%%",
      mixable: true,
      expelEnclosingWhitespace: true,
    };
  }

  parseMarkdown() {
    return { mark: "highlight_green" };
  }
}
