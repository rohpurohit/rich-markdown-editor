import {
  BlockQuoteIcon,
  BulletedListIcon,
  CodeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  HorizontalRuleIcon,
  OrderedListIcon,
  PageBreakIcon,
  TableIcon,
  TodoListIcon,
  ImageIcon,
  LinkIcon,
} from "outline-icons";
import { EmbedDescriptor, GroupMenuItem } from "../types";
import baseDictionary from "../dictionary";
import { CircleIcon, RemoveIcon } from "../icons";
import { isAnyMarkActive } from "../queries/isMarkActive";
import removeMarks from "../commands/removeMarks";
import { EditorView } from "prosemirror-view";

const SSR = typeof window === "undefined";
const isMac = !SSR && window.navigator.platform === "MacIntel";
const mod = isMac ? "⌘" : "ctrl";

export const groupedBlockMenu = (
  view: EditorView,
  dictionary: typeof baseDictionary
): GroupMenuItem[] => {
  const { state } = view;
  const { schema } = state;

  const allMarks = [
    schema.marks.highlight_default,
    schema.marks.highlight_orange,
    schema.marks.highlight_yellow,
    schema.marks.highlight_green,
    schema.marks.highlight_blue,
  ];

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
          icon: Heading1Icon,
          shortcut: "^ ⇧ 1",
          attrs: { level: 1 },
        },
        {
          name: "heading",
          title: dictionary.h2,
          keywords: "h2 heading2",
          mainKeyword: "h2",
          icon: Heading2Icon,
          shortcut: "^ ⇧ 2",
          attrs: { level: 2 },
        },
        {
          name: "heading",
          title: dictionary.h3,
          keywords: "h3 heading3",
          mainKeyword: "h3",
          icon: Heading3Icon,
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
          icon: TodoListIcon,
          keywords: "checklist checkbox task",
          mainKeyword: "todo",
          shortcut: "^ ⇧ 7",
        },
        {
          name: "bullet_list",
          title: dictionary.bulletList,
          icon: BulletedListIcon,
          keywords: "bullet list",
          mainKeyword: "bullet",
          shortcut: "^ ⇧ 8",
        },
        {
          name: "ordered_list",
          title: dictionary.orderedList,
          icon: OrderedListIcon,
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
          icon: ImageIcon,
          mainKeyword: "image",
          keywords: "picture photo",
        },
        {
          name: "table",
          title: dictionary.table,
          icon: TableIcon,
          mainKeyword: "table",
          attrs: { rowsCount: 3, colsCount: 3 },
        },
        {
          name: "blockquote",
          title: dictionary.quote,
          icon: BlockQuoteIcon,
          mainKeyword: "quote",
          shortcut: `${mod} ]`,
        },
        {
          name: "code_block",
          title: dictionary.codeBlock,
          icon: CodeIcon,
          shortcut: "^ ⇧ \\",
          keywords: "script code",
          mainKeyword: "code",
        },
        {
          name: "hr",
          title: dictionary.hr,
          icon: HorizontalRuleIcon,
          shortcut: `${mod} _`,
          keywords: "horizontal rule break line",
          mainKeyword: "divider",
        },
        {
          name: "hr",
          title: dictionary.pageBreak,
          icon: PageBreakIcon,
          keywords: "page print break line",
          mainKeyword: "page break",
          attrs: { markup: "***" },
        },
        {
          name: "link",
          title: dictionary.link,
          icon: LinkIcon,
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
          icon: CircleIcon,
          iconSVGProps: {
            r: 11,
            cx: 11,
            cy: 11,
            fill: schema.marks.highlight_default.attrs.color.default,
          },
          keywords: "highlight red",
          mainKeyword: "red",
          shortcut: "alt shift 1",
        },
        {
          name: "highlight_orange",
          title: "Orange",
          icon: CircleIcon,
          iconSVGProps: {
            r: 11,
            cx: 11,
            cy: 11,
            fill: schema.marks.highlight_orange.attrs.color.default,
          },
          keywords: "highlight orange",
          mainKeyword: "orange",
          shortcut: "alt shift 2",
        },
        {
          name: "highlight_yellow",
          title: "Yellow",
          icon: CircleIcon,
          iconSVGProps: {
            r: 11,
            cx: 11,
            cy: 11,
            fill: schema.marks.highlight_yellow.attrs.color.default,
          },
          keywords: "highlight yellow",
          mainKeyword: "yellow",
          shortcut: "alt shift 3",
        },
        {
          name: "highlight_green",
          title: "Green",
          icon: CircleIcon,
          iconSVGProps: {
            r: 11,
            cx: 11,
            cy: 11,
            fill: schema.marks.highlight_green.attrs.color.default,
          },
          keywords: "highlight green",
          mainKeyword: "green",
          shortcut: "alt shift 4",
        },
        {
          name: "highlight_blue",
          title: "Blue",
          icon: CircleIcon,
          iconSVGProps: {
            r: 11,
            cx: 11,
            cy: 11,
            fill: schema.marks.highlight_blue.attrs.color.default,
          },
          keywords: "highlight blue",
          mainKeyword: "blue",
          shortcut: "alt shift 5",
        },
        {
          name: "highlight_remove",
          title: "No highlight",
          icon: CircleIcon,
          iconSVGProps: {
            r: 10,
            cx: 11,
            cy: 11,
            strokeWidth: 1,
            fill: "#fff",
            stroke: "#777",
          },
          keywords: "highlight remove unhighlight",
          mainKeyword: "unhighlight",
          shortcut: "", //TODO: add shortcut
          customOnClick: () => removeMarks(view, allMarks),
        },
      ],
    },
  ];
};

export const getEmbedsGroup = (embeds: EmbedDescriptor[]): GroupMenuItem => {
  const embedItems: EmbedDescriptor[] = [];

  for (const embed of embeds) {
    if (embed.title && embed.icon) {
      embedItems.push({
        ...embed,
        name: "embed",
      });
    }
  }

  return {
    groupData: { name: "Other" },
    items: embedItems,
  };
};
