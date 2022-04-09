"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const outline_icons_1 = require("outline-icons");
const isNodeActive_1 = __importDefault(require("../queries/isNodeActive"));
function imageMenuItems(state, dictionary) {
    const { schema } = state;
    const isLeftAligned = isNodeActive_1.default(schema.nodes.image, {
        layoutClass: "left-50",
    });
    const isRightAligned = isNodeActive_1.default(schema.nodes.image, {
        layoutClass: "right-50",
    });
    return [
        {
            name: "replaceImage",
            tooltip: dictionary.replaceImage,
            icon: outline_icons_1.ReplaceIcon,
            visible: true,
            active: () => false,
        },
        {
            name: "deleteImage",
            tooltip: dictionary.deleteImage,
            icon: outline_icons_1.TrashIcon,
            visible: true,
            active: () => false,
        },
    ];
}
exports.default = imageMenuItems;
//# sourceMappingURL=image.js.map