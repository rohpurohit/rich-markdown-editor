"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_commands_1 = require("prosemirror-commands");
const markInputRule_1 = __importDefault(require("../lib/markInputRule"));
const Mark_1 = __importDefault(require("./Mark"));
const mark_1 = __importDefault(require("../rules/mark"));
class Highlight extends Mark_1.default {
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
        return [markInputRule_1.default(/(?:==)([^=]+)(?:==)$/, type)];
    }
    keys({ type }) {
        return {
            "Mod-Ctrl-h": prosemirror_commands_1.toggleMark(type),
        };
    }
    commands({ type }) {
        return (attrs) => {
            return prosemirror_commands_1.toggleMark(type, attrs);
        };
    }
    get rulePlugins() {
        return [mark_1.default({ delim: "==", mark: "highlight" })];
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
        };
    }
}
exports.default = Highlight;
//# sourceMappingURL=Highlight.js.map