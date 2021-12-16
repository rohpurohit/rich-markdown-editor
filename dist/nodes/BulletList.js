"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
const prosemirror_transform_1 = require("prosemirror-transform");
const toggleList_1 = __importDefault(require("../commands/toggleList"));
const Node_1 = __importDefault(require("./Node"));
class BulletList extends Node_1.default {
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
        return () => toggleList_1.default(type, schema.nodes.list_item);
    }
    keys({ type, schema }) {
        return {
            "Shift-Ctrl-8": toggleList_1.default(type, schema.nodes.list_item),
        };
    }
    inputRules({ type }) {
        return [
            prosemirror_inputrules_1.wrappingInputRule(/^\s*([-+*])\s$/, type),
            new prosemirror_inputrules_1.InputRule(/^[\s\t\f]*[a-z,A-Z,0-9]?$/, (state, [matchStr], start, end) => {
                const tr = !matchStr.trim()
                    ? state.tr.delete(start, end)
                    : state.tr.insertText(matchStr, start, end);
                const $start = tr.doc.resolve(start);
                const range = $start.blockRange();
                const wrapping = range && prosemirror_transform_1.findWrapping(range, type);
                if (!wrapping)
                    return null;
                tr.wrap(range, wrapping);
                const before = tr.doc.resolve(start - 1).nodeBefore;
                if (before && before.type == type && prosemirror_transform_1.canJoin(tr.doc, start - 1))
                    tr.join(start - 1);
                return tr;
            }),
        ];
    }
    toMarkdown(state, node) {
        state.renderList(node, "  ", () => (node.attrs.bullet || "*") + " ");
    }
    parseMarkdown() {
        return { block: "bullet_list" };
    }
}
exports.default = BulletList;
//# sourceMappingURL=BulletList.js.map