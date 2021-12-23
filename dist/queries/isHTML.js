"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHTML = void 0;
const isHTML = (str) => {
    const doc = new DOMParser().parseFromString(str, "text/html");
    return Array.from(doc.body.childNodes).some((node) => node.nodeType === 1);
};
exports.isHTML = isHTML;
//# sourceMappingURL=isHTML.js.map