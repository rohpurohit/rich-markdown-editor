import { toggleMark } from "prosemirror-commands";
import markInputRule from "../../lib/markInputRule";
import Mark from "../Mark";
import markRule from "../../rules/mark";

export default class BlueHighlight extends Mark {
  get name() {
    return "highlight_blue";
  }

  get schema() {
    return {
      parseDOM: [
        {
          tag: "mark",
          getAttrs: (node) => node.getAttribute("class") === "blue",
        },
        {
          style: "background-color",
          getAttrs: (value) => !!value && value === "blue",
        },
      ],
      toDOM: () => ["mark", { class: "blue" }],
    };
  }

  inputRules({ type }) {
    return [markInputRule(/(?:=b=)([^=]+)(?:=b=)$/, type)];
  }

  keys({ type }) {
    return {
      //   "Mod-Ctrl-h": toggleMark(type),
    };
  }

  commands({ type }) {
    return (attrs: any) => {
      return toggleMark(type, attrs);
    };
  }

  get rulePlugins() {
    return [markRule({ delim: "=b=", mark: "highlight_blue" })];
  }

  get toMarkdown() {
    return {
      open: "=b=",
      close: "=b=",
      mixable: true,
      expelEnclosingWhitespace: true,
    };
  }

  parseMarkdown() {
    return { mark: "highlight_blue" };
  }
}
