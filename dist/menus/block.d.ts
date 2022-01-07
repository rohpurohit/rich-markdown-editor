import { EmbedDescriptor, GroupMenuItem } from "../types";
import baseDictionary from "../dictionary";
import { EditorView } from "prosemirror-view";
export declare const groupedBlockMenu: (view: EditorView, dictionary: typeof baseDictionary) => GroupMenuItem[];
export declare const getEmbedsGroup: (embeds: EmbedDescriptor[]) => GroupMenuItem;
//# sourceMappingURL=block.d.ts.map