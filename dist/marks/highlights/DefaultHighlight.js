"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_commands_1 = require("prosemirror-commands");
const markInputRule_1 = __importDefault(require("../../lib/markInputRule"));
const Mark_1 = __importDefault(require("../Mark"));
const mark_1 = __importDefault(require("../../rules/mark"));
class DefaultHighlight extends Mark_1.default {
    get name() {
        return "highlight_default";
    }
    get schema() {
        return {
            attrs: {
                color: {
                    default: "#FFDBDB",
                },
            },
            excludes: "highlight",
            group: "highlight",
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
        return [markInputRule_1.default(/(?:==)([^=]+)(?:==)$/, type)];
    }
    commands({ type }) {
        return () => prosemirror_commands_1.toggleMark(type);
    }
    get rulePlugins() {
        return [mark_1.default({ delim: "==", mark: "highlight_default" })];
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
exports.default = DefaultHighlight;
//# sourceMappingURL=DefaultHighlight.js.map