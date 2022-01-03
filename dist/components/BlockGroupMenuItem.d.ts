import * as React from "react";
import { light as theme } from "@styles/theme";
export declare type Props = {
    title: string;
    theme: typeof theme;
    selected: boolean;
    disabled?: boolean;
    onClick: () => void;
    containerId?: string;
};
declare const _default: React.ForwardRefExoticComponent<Pick<Props, "disabled" | "title" | "onClick" | "selected" | "containerId"> & {
    theme?: any;
}>;
export default _default;
//# sourceMappingURL=BlockGroupMenuItem.d.ts.map