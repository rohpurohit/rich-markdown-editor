import * as React from "react";
import { EditorState } from "prosemirror-state";
export declare enum ToastType {
    Error = "error",
    Info = "info"
}
export declare type MenuItem = {
    icon?: typeof React.Component | React.FC<any>;
    name?: string;
    title?: string;
    shortcut?: string;
    keywords?: string;
    tooltip?: string;
    defaultHidden?: boolean;
    attrs?: Record<string, any>;
    visible?: boolean;
    active?: (state: EditorState) => boolean;
};
export declare type EmbedDescriptor = MenuItem & {
    matcher: (url: string) => boolean | [] | RegExpMatchArray;
    component: typeof React.Component | React.FC<any>;
};
export declare type MenuPosition = {
    left: number;
    top?: number;
    bottom?: number;
    isAbove: boolean;
};
export declare type GroupMenuItem = {
    groupData: GroupData;
    items: MenuItem[];
};
export declare type GroupData = {
    name: string;
};
//# sourceMappingURL=index.d.ts.map