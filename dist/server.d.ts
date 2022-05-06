import { Schema } from "prosemirror-model";
export declare const schema: Schema<never, never>;
export declare const parseHTML: (html: any) => import("prosemirror-model").Node<Schema<never, never>>;
export declare const serializeToHTML: (doc: any) => string;
export declare const parseMarkdown: (markdown: string) => import("prosemirror-model").Node<any>;
export declare const serializeToMarkdown: (doc: any) => string;
export declare const mdToHtml: (markdown: string) => string;
export declare const htmlToMd: (html: string) => string;
export declare const externalHtmlOrMdToHtml: (content: any) => string;
//# sourceMappingURL=server.d.ts.map