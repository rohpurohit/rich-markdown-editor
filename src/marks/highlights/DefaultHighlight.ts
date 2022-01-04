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
    return [markInputRule(/(?:=r=)([^=]+)(?:=r=)$/, type)];
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
    return [markRule({ delim: "=r=", mark: "highlight_default" })];
  }

  get toMarkdown() {
    return {
      open: "=r=",
      close: "=r=",
      mixable: true,
      expelEnclosingWhitespace: true,
    };
  }

  parseMarkdown() {
    return { mark: "highlight_default" };
  }
}
