import * as React from "react";
import theme from "../styles/theme";
export declare type Props = {
    selected: boolean;
    disabled?: boolean;
    onClick: () => void;
    theme: typeof theme;
    icon?: typeof React.Component | React.FC<any>;
    iconColor?: string;
    iconSize?: number;
    title: React.ReactNode;
    shortcut?: string;
    containerId?: string;
    isSearch?: boolean;
    mainSearchKeyword?: string;
};
declare const _default: React.ForwardRefExoticComponent<Pick<Props, "icon" | "disabled" | "title" | "onClick" | "selected" | "shortcut" | "iconColor" | "iconSize" | "isSearch" | "mainSearchKeyword" | "containerId"> & {
    theme?: any;
}>;
export default _default;
//# sourceMappingURL=BlockMenuItem.d.ts.map