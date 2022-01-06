"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_commands_1 = require("prosemirror-commands");
const markInputRule_1 = __importDefault(require("../../lib/markInputRule"));
const Mark_1 = __importDefault(require("../Mark"));
const mark_1 = __importDefault(require("../../rules/mark"));
class YellowHighlight extends Mark_1.default {
    get name() {
        return "highlight_yellow";
    }
    get schema() {
        return {
            attrs: {
                color: {
                    default: "#FFFCCF",
                },
            },
            excludes: "highlight",
            group: "highlight",
            parseDOM: [
                {
                    tag: "mark",
                    getAttrs: (node) => node.getAttribute("class") === "yellow",
                },
                {
                    style: "background-color",
                    getAttrs: (value) => !!value && value === "yellow",
                },
            ],
            toDOM: () => ["mark", { class: "yellow" }],
        };
    }
    inputRules({ type }) {
        return [markInputRule_1.default(/(?:\$\$)([^=]+)(?:\$\$)$/, type)];
    }
    keys({ type }) {
        return {
            "Alt-Shift-3": prosemirror_commands_1.toggleMark(type),
        };
    }
    commands({ type }) {
        return () => prosemirror_commands_1.toggleMark(type);
    }
    get rulePlugins() {
        return [mark_1.default({ delim: "$$", mark: "highlight_yellow" })];
    }
    get toMarkdown() {
        return {
            open: "$$",
            close: "$$",
            mixable: true,
            expelEnclosingWhitespace: true,
        };
    }
    parseMarkdown() {
        return { mark: "highlight_yellow" };
    }
}
exports.default = YellowHighlight;
//# sourceMappingURL=YellowHighlight.js.map