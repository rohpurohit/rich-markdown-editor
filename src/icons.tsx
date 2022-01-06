import React from "react";
import { Icon as IconWrapper } from "outline-icons";

type CircleIconProps = {
  color: string;
  size: number;
};

export const CircleIcon = ({
  color,
  size,
}: CircleIconProps): React.ReactElement<CircleIconProps> => (
  <IconWrapper color={color} size={size}>
    <circle fill={color} cx={size / 2} cy={size / 2} r={size / 2} />
  </IconWrapper>
);
