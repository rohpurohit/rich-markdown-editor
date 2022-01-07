"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const YoutubeEmbed = ({ attrs, isSelected, }) => {
    const videoId = attrs.matches[1];
    return (react_1.default.createElement("iframe", { className: isSelected ? "ProseMirror-selectednode" : "", src: `https://www.youtube.com/embed/${videoId}?modestbranding=1` }));
};
exports.default = {
    title: "YouTube",
    keywords: "youtube video tube google",
    icon: () => (react_1.default.createElement("img", { src: "https://upload.wikimedia.org/wikipedia/commons/7/75/YouTube_social_white_squircle_%282017%29.svg", width: 24, height: 24 })),
    matcher: (url) => {
        return url.match(/(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([a-zA-Z0-9_-]{11})$/i);
    },
    component: YoutubeEmbed,
};
//# sourceMappingURL=YoutubeEmbed.js.map