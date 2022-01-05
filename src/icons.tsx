import React from "react";
import { Icon } from "outline-icons";

type CircleIconProps = {
  color: string;
  size: number;
};

export const CircleIcon = ({
  color,
  size,
}: CircleIconProps): React.ReactElement<CircleIconProps> => {
  console.log(size);
  return (
    <Icon color={color} size={size}>
      <circle fill={color} cx={size / 2} cy={size / 2} r={size / 2} />
    </Icon>
  );
};
