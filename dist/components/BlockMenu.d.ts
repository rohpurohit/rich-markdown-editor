import React from "react";
import { Props } from "./KnowtCommandMenu";
declare type BlockMenuProps = Omit<Props, "renderMenuItem" | "renderGroupMenuItem" | "items" | "groupedItems" | "onClearSearch"> & Required<Pick<Props, "onLinkToolbarOpen" | "embeds">>;
declare class BlockMenu extends React.Component<BlockMenuProps> {
    get items(): import("../types").MenuItem[];
    get groupedItems(): import("../types").GroupMenuItem[];
    clearSearch: () => void;
    render(): JSX.Element;
}
export default BlockMenu;
//# sourceMappingURL=BlockMenu.d.ts.map