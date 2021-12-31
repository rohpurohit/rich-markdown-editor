"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isSelectionAtStart(doc) {
    var _a;
    return (doc.textContent === "" &&
        doc.content.childCount === 1 &&
        ((_a = doc.content.firstChild) === null || _a === void 0 ? void 0 : _a.type.name) === "paragraph");
}
exports.default = isSelectionAtStart;
//# sourceMappingURL=isEmptyDoc.js.map