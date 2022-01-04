import { toggleMark } from "prosemirror-commands";
import markInputRule from "../lib/markInputRule";
import Mark from "./Mark";
import markRule from "../rules/mark";

export default class Highlight extends Mark {
  get name() {
    return "highlight";
  }

  get schema() {
    return {
      attrs: {
        class: {
          default: "red",
        },
      },
      parseDOM: [
        {
          tag: "mark",
          getAttrs: (node) => {
            return { class: node.getAttribute("class") };
          },
        },
        {
          style: "background-color",
          getAttrs: (value) => !!value && value !== "transparent",
        },
      ],
      toDOM: (node) => ["mark", { class: node.attrs.class }],
    };
  }

  inputRules({ type }) {
    return [markInputRule(/(?:==)([^=]+)(?:==)$/, type)];
  }

  keys({ type }) {
    return {
      "Mod-Ctrl-h": toggleMark(type),
    };
  }

  commands({ type }) {
    return (attrs: any) => {
      return toggleMark(type, attrs);
    };
  }

  get rulePlugins() {
    return [markRule({ delim: "==", mark: "highlight" })];
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
    return {
      mark: "highlight",
      getAttrs: (token) => {
        console.log(token);
        return {
          level: +token.tag.slice(1),
        };
      },
    };
  }
}
