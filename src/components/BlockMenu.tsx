import React from "react";
import { findParentNode } from "prosemirror-utils";
import KnowtCommandMenu, { Props } from "./KnowtCommandMenu";
import BlockMenuItem from "./BlockMenuItem";
import BlockGroupMenuItem from "./BlockGroupMenuItem";
import getMenuItems, {
  groupedBlockMenu as getGroupedMenuItems,
} from "../menus/block";

type BlockMenuProps = Omit<
  Props,
  | "renderMenuItem"
  | "renderGroupMenuItem"
  | "items"
  | "groupedItems"
  | "onClearSearch"
> &
  Required<Pick<Props, "onLinkToolbarOpen" | "embeds">>;

class BlockMenu extends React.Component<BlockMenuProps> {
  get items() {
    return getMenuItems(this.props.dictionary);
  }

  get groupedItems() {
    return getGroupedMenuItems(this.props.dictionary);
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
              icon={item.icon}
              title={item.title}
              shortcut={item.shortcut}
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
        items={this.items}
        groupedItems={this.groupedItems}
      />
    );
  }
}

export default BlockMenu;
