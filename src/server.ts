/* Not quite a server file, it has to be run in the browser, 
as it uses browser API to serialize the prosemirror doc AST to html */

import { Schema, DOMParser, DOMSerializer } from "prosemirror-model";
import ExtensionManager from "./lib/ExtensionManager";
import { isHTML } from "./domHelpers";

// nodes
import Doc from "./nodes/Doc";
import Text from "./nodes/Text";
import Blockquote from "./nodes/Blockquote";
import Emoji from "./nodes/Emoji";
import BulletList from "./nodes/BulletList";
import CodeBlock from "./nodes/CodeBlock";
import CodeFence from "./nodes/CodeFence";
import CheckboxList from "./nodes/CheckboxList";
import CheckboxItem from "./nodes/CheckboxItem";
import Embed from "./nodes/Embed";
import HardBreak from "./nodes/HardBreak";
import Heading from "./nodes/Heading";
import HorizontalRule from "./nodes/HorizontalRule";
import Image from "./nodes/Image";
import ListItem from "./nodes/ListItem";
import Notice from "./nodes/Notice";
import OrderedList from "./nodes/OrderedList";
import Paragraph from "./nodes/Paragraph";
import Table from "./nodes/Table";
import TableCell from "./nodes/TableCell";
import TableHeadCell from "./nodes/TableHeadCell";
import TableRow from "./nodes/TableRow";

// marks
import Bold from "./marks/Bold";
import Code from "./marks/Code";
import Italic from "./marks/Italic";
import Link from "./marks/Link";
import Strikethrough from "./marks/Strikethrough";
import TemplatePlaceholder from "./marks/Placeholder";
import Underline from "./marks/Underline";
import OrangeHighlight from "./marks/highlights/OrangeHighlight";
import YellowHighlight from "./marks/highlights/YellowHighlight";
import BlueHighlight from "./marks/highlights/BlueHighlight";
import GreenHighlight from "./marks/highlights/GreenHighlight";
import DefaultHighlight from "./marks/highlights/DefaultHighlight";

const extensions = new ExtensionManager([
  new Doc(),
  new Text(),
  new HardBreak(),
  new Paragraph(),
  new Blockquote(),
  new Emoji(),
  new BulletList(),
  new CodeBlock(),
  new CodeFence(),
  new CheckboxList(),
  new CheckboxItem(),
  new Embed(),
  new ListItem(),
  new Notice(),
  new Heading(),
  new HorizontalRule(),
  new Image(),
  new Table(),
  new TableCell(),
  new TableHeadCell(),
  new TableRow(),
  new Bold(),
  new Code(),
  new Italic(),
  new Link(),
  new Strikethrough(),
  new TemplatePlaceholder(),
  new Underline(),
  new OrderedList(),
  new OrangeHighlight(),
  new YellowHighlight(),
  new BlueHighlight(),
  new GreenHighlight(),
  new DefaultHighlight(),
]);

export const schema = new Schema({
  nodes: extensions.nodes,
  marks: extensions.marks,
});

const domParser = DOMParser.fromSchema(schema);
const domSerializer = DOMSerializer.fromSchema(schema);

const markdownParser = extensions.parser({
  schema,
  plugins: extensions.rulePlugins,
});
const markdownSerializer = extensions.serializer();

export const parseHTML = (html) => {
  const domNode = document.createElement("div");
  domNode.innerHTML = html;
  return domParser.parse(domNode);
};

export const serializeToHTML = (doc) => {
  const serializedFragment = domSerializer.serializeFragment(doc.content);
  const throwAwayDiv = document.createElement("div");
  throwAwayDiv.appendChild(serializedFragment);
  return throwAwayDiv.innerHTML;
};

export const parseMarkdown = (markdown: string) => {
  return markdownParser.parse(markdown);
};

export const serializeToMarkdown = (doc) => {
  return markdownSerializer.serialize(doc);
};

export const mdToHtml = (markdown: string): string => {
  const doc = parseMarkdown(markdown);
  return serializeToHTML(doc);
};

export const htmlToMd = (html: string): string => {
  const doc = parseHTML(html);
  return serializeToMarkdown(doc);
};

export const externalHtmlOrMdToHtml = (content) => {
  if (isHTML(content)) {
    return serializeToHTML(parseHTML(content));
  } else {
    return mdToHtml(content);
  }
};
