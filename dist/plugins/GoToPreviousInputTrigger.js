"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_state_1 = require("prosemirror-state");
const Extension_1 = __importDefault(require("../lib/Extension"));
const isCursorAt_1 = __importDefault(require("../queries/isCursorAt"));
const isFirstLine_1 = __importDefault(require("../queries/isFirstLine"));
const isInList_1 = __importDefault(require("../queries/isInList"));
class GoToPreviousInputTrigger extends Extension_1.default {
    get name() {
        return "goto_previous_input";
    }
    get plugins() {
        return [
            new prosemirror_state_1.Plugin({
                props: {
                    handleKeyDown: (view, event) => {
                        var _a;
                        if (event.key === "Backspace" &&
                            isCursorAt_1.default(1, view.state) &&
                            ((_a = view.state.doc.content.firstChild) === null || _a === void 0 ? void 0 : _a.type.name) === "paragraph") {
                            event.preventDefault();
                            this.options.onGoToPreviousInput();
                            return true;
                        }
                        if (event.key === "ArrowUp" && isFirstLine_1.default(this.editor, view)) {
                            event.preventDefault();
                            this.options.onGoToPreviousInput();
                            return true;
                        }
                        if (event.key === "ArrowLeft" && isFirstLine_1.default(this.editor, view)) {
                            if ((isCursorAt_1.default(3, view.state) && isInList_1.default(view.state)) ||
                                isCursorAt_1.default(1, view.state)) {
                                event.preventDefault();
                                this.options.onGoToPreviousInput();
                                return true;
                            }
                        }
                        return false;
                    },
                },
            }),
        ];
    }
}
exports.default = GoToPreviousInputTrigger;
//# sourceMappingURL=GoToPreviousInputTrigger.js.map