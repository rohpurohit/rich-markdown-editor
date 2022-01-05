import React from "react";
import { findParentNode } from "prosemirror-utils";
import KnowtCommandMenu, { Props } from "./KnowtCommandMenu";
import BlockMenuItem from "./BlockMenuItem";
import BlockGroupMenuItem from "./BlockGroupMenuItem";
import {
  getEmbedsGroup,
  groupedBlockMenu as getGroupedMenuItems,
} from "../menus/block";
import { GroupMenuItem } from "../types";

type BlockMenuProps = Omit<
  Props,
  | "renderMenuItem"
  | "renderGroupMenuItem"
  | "allGroups"
  | "visibleGroups"
  | "onClearSearch"
> &
  Required<Pick<Props, "onLinkToolbarOpen" | "embeds">>;

class BlockMenu extends React.Component<BlockMenuProps> {
  // grouped items without embeds
  get groupedItems(): GroupMenuItem[] {
    return getGroupedMenuItems(this.props.view.state, this.props.dictionary);
  }

  get embedsGroup(): GroupMenuItem {
    return getEmbedsGroup(this.props.embeds);
  }

  get allGroups(): GroupMenuItem[] {
    return [...this.groupedItems, this.embedsGroup];
  }

  // items + embeds groups - filter out default hidden items
  get visibleGroups(): GroupMenuItem[] {
    return this.allGroups
      .map((group) => ({
        ...group,
        items: group.items.filter(({ defaultHidden }) => !defaultHidden),
      }))
      .filter(({ items }) => items.length > 0);
  }

  clearSearch = () => {
    const { state, dispatch } = this.props.view;
    const parent = findParentNode((node) => !!node)(state.selection);

    if (parent) {
      dispatch(state.tr.insertText("", parent.pos, state.selection.to));
    }
  };

  render() {
    return (
      <KnowtCommandMenu
        {...this.props}
        filterable={true}
        onClearSearch={this.clearSearch}
        renderMenuItem={(item, _index, options) => {
          return (
            <BlockMenuItem
              key={item.title}
              onClick={options.onClick}
              selected={options.selected}
              isSearch={options.isSearch}
              icon={item.icon}
              iconColor={item.iconColor}
              iconSize={item.iconSize}
              title={item.title}
              shortcut={item.shortcut}
              mainSearchKeyword={item.mainKeyword}
            />
          );
        }}
        renderGroupMenuItem={(item, _index, innerRef, options) => {
          return (
            <BlockGroupMenuItem
              innerRef={innerRef}
              key={item.groupData.name}
              title={item.groupData.name}
              selected={options.selected}
              onClick={options.onClick}
            />
          );
        }}
        visibleGroups={this.visibleGroups}
        allGroups={this.allGroups}
      />
    );
  }
}

export default BlockMenu;
