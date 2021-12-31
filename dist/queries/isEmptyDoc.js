"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isEmptyDoc(doc) {
    var _a;
    return (doc.textContent === "" &&
        doc.content.childCount === 1 &&
        ((_a = doc.content.firstChild) === null || _a === void 0 ? void 0 : _a.type.name) === "paragraph");
}
exports.default = isEmptyDoc;
//# sourceMappingURL=isEmptyDoc.js.map