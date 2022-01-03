import * as React from "react";
import scrollIntoView from "smooth-scroll-into-view-if-needed";
import styled, { withTheme } from "styled-components";
import { theme } from "..";

import ArrowIcon from "../assets/right-arrow.png";

export type Props = {
  title: string;
  theme: typeof theme;
  selected: boolean;
  disabled?: boolean;
  innerRef?: (ref: HTMLDivElement) => void;
  onClick: () => void;
  containerId?: string;
};

function BlockGroupMenuItem(props: Props) {
  const {
    title,
    selected,
    disabled = false,
    onClick,
    containerId = "block-menu-container",
    innerRef,
  } = props;

  const ref = React.useCallback(
    (node) => {
      innerRef(node);
      if (selected && node) {
        scrollIntoView(node, {
          scrollMode: "if-needed",
          block: "center",
          boundary: (parent) => {
            // All the parent elements of your target are checked until they
            // reach the #block-menu-container. Prevents body and other parent
            // elements from being scrolled
            return parent.id !== containerId;
          },
        });
      }
    },
    [selected, containerId, innerRef]
  );

  return (
    <MenuItem
      selected={selected}
      onClick={disabled ? undefined : onClick}
      ref={ref}
    >
      {title}
      <Circle>
        <Icon src={ArrowIcon} />
      </Circle>
    </MenuItem>
  );
}

const MenuItem = styled.button<{
  selected: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;
  font-size: 14px;
  line-height: 1;
  width: 100%;
  height: 36px;
  cursor: pointer;
  border: none;
  opacity: ${(props) => (props.disabled ? ".5" : "1")};
  color: ${(props) =>
    props.selected
      ? props.theme.blockToolbarTextSelected
      : props.theme.blockToolbarText};
  background: ${(props) =>
    props.selected
      ? props.theme.blockToolbarSelectedBackground ||
        props.theme.blockToolbarTrigger
      : "none"};
  padding: 0 16px;
  outline: none;

  &:hover,
  &:active {
    color: ${(props) => props.theme.blockToolbarTextSelected};
    background: ${(props) =>
      props.selected
        ? props.theme.blockToolbarSelectedBackground ||
          props.theme.blockToolbarTrigger
        : props.theme.blockToolbarHoverBackground};
  }
`;

const CIRCLE_RADIUS = 20;
const ICON_DIMENSIONS = 15;

const Circle = styled.div`
  display: flex;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  width: ${CIRCLE_RADIUS}px;
  height: ${CIRCLE_RADIUS}px;
  min-width: ${CIRCLE_RADIUS}px;
  max-width: ${CIRCLE_RADIUS}px;
  min-height: ${CIRCLE_RADIUS}px;
  max-height: ${CIRCLE_RADIUS}px;
  border: 1px solid ${(props) => props.theme.blockToolbarDivider};
`;

const Icon = styled.img`
  width: ${ICON_DIMENSIONS}px;
  height: ${ICON_DIMENSIONS}px;
`;

export default withTheme(BlockGroupMenuItem);
