"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const theme_1 = require("../styles/theme");
const __1 = __importDefault(require(".."));
const docSearchResults = [
    {
        title: "Hiring",
        subtitle: "Created by Jane",
        url: "/doc/hiring"
    },
    {
        title: "Product Roadmap",
        subtitle: "Created by Tom",
        url: "/doc/product-roadmap"
    },
    {
        title: "Finances",
        subtitle: "Created by Coley",
        url: "/doc/finances"
    },
    {
        title: "Security",
        subtitle: "Created by Coley",
        url: "/doc/security"
    },
    {
        title: "Super secret stuff",
        subtitle: "Created by Coley",
        url: "/doc/secret-stuff"
    },
    {
        title: "Supero notes",
        subtitle: "Created by Vanessa",
        url: "/doc/supero-notes"
    },
    {
        title: "Meeting notes",
        subtitle: "Created by Rob",
        url: "/doc/meeting-notes"
    }
];
class YoutubeEmbed extends React.Component {
    render() {
        const { attrs } = this.props;
        const videoId = attrs.matches[1];
        return (React.createElement("iframe", { className: this.props.isSelected ? "ProseMirror-selectednode" : "", src: `https://www.youtube.com/embed/${videoId}?modestbranding=1` }));
    }
}
const text = `
<h1 style="text-align: justify;">
    What is a Cell
</h1>
<p style="text-align: justify;">
    In biology, the smallest unit that can live on its own and that makes up all living organisms and the tissues of the body.
    A cell has three main parts: the cell membrane, the nucleus, and the cytoplasm.
    The cell membrane surrounds the cell and controls the substances that go into and out of the cell.
    The nucleus is a structure inside the cell that contains the nucleolus and most of the cell&rsquo;s DNA.
</p>
`;
function Example(props) {
    const { body } = document;
    if (body)
        body.style.backgroundColor = props.dark
            ? theme_1.dark.background
            : theme_1.light.background;
    return (React.createElement("div", { style: { padding: "1em 2em" } },
        React.createElement(__1.default, Object.assign({ defaultValue: text, onCreateLink: title => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        if (title !== "error") {
                            return resolve(`/doc/${encodeURIComponent(title.toLowerCase())}`);
                        }
                        else {
                            reject("500 error");
                        }
                    }, 1500);
                });
            }, onSearchLink: async (term) => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        resolve(docSearchResults.filter(result => result.title.toLowerCase().includes(term.toLowerCase())));
                    }, Math.random() * 500);
                });
            }, uploadImage: file => {
                return new Promise(resolve => {
                    setTimeout(() => resolve(URL.createObjectURL(file)), 1500);
                });
            } }, props))));
}
exports.default = Example;
//# sourceMappingURL=index.js.map