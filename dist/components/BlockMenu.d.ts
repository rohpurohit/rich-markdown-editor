import React from "react";
import { Props } from "./KnowtCommandMenu";
import { GroupMenuItem } from "../types";
declare type BlockMenuProps = Omit<Props, "renderMenuItem" | "renderGroupMenuItem" | "allGroups" | "visibleGroups" | "onClearSearch"> & Required<Pick<Props, "onLinkToolbarOpen" | "embeds">>;
declare class BlockMenu extends React.Component<BlockMenuProps> {
    get groupedItems(): GroupMenuItem[];
    get embedsGroup(): GroupMenuItem;
    get allGroups(): GroupMenuItem[];
    get visibleGroups(): GroupMenuItem[];
    clearSearch: (clearLength?: number) => void;
    render(): JSX.Element;
}
export default BlockMenu;
//# sourceMappingURL=BlockMenu.d.ts.map