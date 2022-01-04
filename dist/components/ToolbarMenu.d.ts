import * as React from "react";
import { EditorView } from "prosemirror-view";
import theme from "../styles/theme";
import { MenuItem } from "../types";
declare type Props = {
    tooltip: typeof React.Component | React.FC<any>;
    commands: Record<string, any>;
    view: EditorView;
    theme: typeof theme;
    items: (MenuItem & {
        iconColor?: string;
    })[];
};
declare class ToolbarMenu extends React.Component<Props> {
    render(): JSX.Element;
}
declare const _default: React.ForwardRefExoticComponent<Pick<Props & React.RefAttributes<ToolbarMenu>, "view" | "tooltip" | "commands" | "items" | "ref" | "key"> & {
    theme?: any;
}>;
export default _default;
//# sourceMappingURL=ToolbarMenu.d.ts.map