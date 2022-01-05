"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmbedsGroup = exports.groupedBlockMenu = void 0;
const outline_icons_1 = require("outline-icons");
const icons_1 = require("../icons");
const SSR = typeof window === "undefined";
const isMac = !SSR && window.navigator.platform === "MacIntel";
const mod = isMac ? "⌘" : "ctrl";
const groupedBlockMenu = (state, dictionary) => {
    const { schema } = state;
    return [
        {
            groupData: {
                name: "Headers",
            },
            items: [
                {
                    name: "heading",
                    title: dictionary.h1,
                    keywords: "h1 heading1 title",
                    mainKeyword: "h1",
                    icon: outline_icons_1.Heading1Icon,
                    shortcut: "^ ⇧ 1",
                    attrs: { level: 1 },
                },
                {
                    name: "heading",
                    title: dictionary.h2,
                    keywords: "h2 heading2",
                    mainKeyword: "h2",
                    icon: outline_icons_1.Heading2Icon,
                    shortcut: "^ ⇧ 2",
                    attrs: { level: 2 },
                },
                {
                    name: "heading",
                    title: dictionary.h3,
                    keywords: "h3 heading3",
                    mainKeyword: "h3",
                    icon: outline_icons_1.Heading3Icon,
                    shortcut: "^ ⇧ 3",
                    attrs: { level: 3 },
                },
            ],
        },
        {
            groupData: {
                name: "Lists",
            },
            items: [
                {
                    name: "checkbox_list",
                    title: dictionary.checkboxList,
                    icon: outline_icons_1.TodoListIcon,
                    keywords: "checklist checkbox task",
                    mainKeyword: "todo",
                    shortcut: "^ ⇧ 7",
                },
                {
                    name: "bullet_list",
                    title: dictionary.bulletList,
                    icon: outline_icons_1.BulletedListIcon,
                    keywords: "bullet list",
                    mainKeyword: "bullet",
                    shortcut: "^ ⇧ 8",
                },
                {
                    name: "ordered_list",
                    title: dictionary.orderedList,
                    icon: outline_icons_1.OrderedListIcon,
                    keywords: "ordered numbered list",
                    mainKeyword: "number",
                    shortcut: "^ ⇧ 9",
                },
            ],
        },
        {
            groupData: {
                name: "Insert",
            },
            items: [
                {
                    name: "image",
                    title: dictionary.image,
                    icon: outline_icons_1.ImageIcon,
                    mainKeyword: "image",
                    keywords: "picture photo",
                },
                {
                    name: "table",
                    title: dictionary.table,
                    icon: outline_icons_1.TableIcon,
                    mainKeyword: "table",
                    attrs: { rowsCount: 3, colsCount: 3 },
                },
                {
                    name: "blockquote",
                    title: dictionary.quote,
                    icon: outline_icons_1.BlockQuoteIcon,
                    mainKeyword: "quote",
                    shortcut: `${mod} ]`,
                },
                {
                    name: "code_block",
                    title: dictionary.codeBlock,
                    icon: outline_icons_1.CodeIcon,
                    shortcut: "^ ⇧ \\",
                    keywords: "script code",
                    mainKeyword: "code",
                },
                {
                    name: "hr",
                    title: dictionary.hr,
                    icon: outline_icons_1.HorizontalRuleIcon,
                    shortcut: `${mod} _`,
                    keywords: "horizontal rule break line",
                    mainKeyword: "divider",
                },
                {
                    name: "hr",
                    title: dictionary.pageBreak,
                    icon: outline_icons_1.PageBreakIcon,
                    keywords: "page print break line",
                    mainKeyword: "page break",
                    attrs: { markup: "***" },
                },
                {
                    name: "link",
                    title: dictionary.link,
                    icon: outline_icons_1.LinkIcon,
                    shortcut: `${mod} k`,
                    keywords: "link url uri href",
                    mainKeyword: "link",
                },
            ],
        },
        {
            groupData: {
                name: "Highlight",
            },
            items: [
                {
                    name: "highlight_default",
                    title: "Red",
                    icon: icons_1.CircleIcon,
                    iconColor: schema.marks.highlight_default.attrs.color.default,
                    iconSize: 22,
                    keywords: "highlight red",
                    mainKeyword: "red",
                    shortcut: "alt shift 1",
                },
                {
                    name: "highlight_orange",
                    title: "Orange",
                    icon: icons_1.CircleIcon,
                    iconColor: schema.marks.highlight_orange.attrs.color.default,
                    iconSize: 22,
                    keywords: "highlight orange",
                    mainKeyword: "orange",
                    shortcut: "alt shift 2",
                },
                {
                    name: "highlight_yellow",
                    title: "Yellow",
                    icon: icons_1.CircleIcon,
                    iconColor: schema.marks.highlight_yellow.attrs.color.default,
                    iconSize: 22,
                    keywords: "highlight yellow",
                    mainKeyword: "yellow",
                    shortcut: "alt shift 3",
                },
                {
                    name: "highlight_green",
                    title: "Green",
                    icon: icons_1.CircleIcon,
                    iconColor: schema.marks.highlight_green.attrs.color.default,
                    iconSize: 22,
                    keywords: "highlight green",
                    mainKeyword: "green",
                    shortcut: "alt shift 4",
                },
                {
                    name: "highlight_blue",
                    title: "Blue",
                    icon: icons_1.CircleIcon,
                    iconColor: schema.marks.highlight_blue.attrs.color.default,
                    iconSize: 22,
                    keywords: "highlight blue",
                    mainKeyword: "blue",
                    shortcut: "alt shift 5",
                },
            ],
        },
    ];
};
exports.groupedBlockMenu = groupedBlockMenu;
const getEmbedsGroup = (embeds) => {
    const embedItems = [];
    for (const embed of embeds) {
        if (embed.title && embed.icon) {
            embedItems.push(Object.assign(Object.assign({}, embed), { name: "embed" }));
        }
    }
    return {
        groupData: { name: "Other" },
        items: embedItems,
    };
};
exports.getEmbedsGroup = getEmbedsGroup;
//# sourceMappingURL=block.js.map