import { EmbedDescriptor, GroupMenuItem } from "../types";
import baseDictionary from "../dictionary";
import { EditorState } from "prosemirror-state";
export declare const groupedBlockMenu: (state: EditorState, dictionary: typeof baseDictionary) => GroupMenuItem[];
export declare const getEmbedsGroup: (embeds: EmbedDescriptor[]) => GroupMenuItem;
//# sourceMappingURL=block.d.ts.map