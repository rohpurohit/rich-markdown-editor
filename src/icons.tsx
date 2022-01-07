import React from "react";
import { Icon as IconWrapper } from "outline-icons";

type iconSVGProps = {
  color?: string;
  size?: number;
  r?: number;
  cx?: number;
  cy?: number;
  fill?: string;
  strokeWidth?: number;
  stroke?: string;
};

export const CircleIcon = ({
  color,
  size,
  ...rest
}: iconSVGProps): React.ReactElement<iconSVGProps> => (
  <IconWrapper color={color} size={size}>
    <circle {...rest} />
  </IconWrapper>
);

export const RemoveIcon = ({
  color,
  size,
}: iconSVGProps): React.ReactElement<iconSVGProps> => (
  <IconWrapper color={color} size={size}>
    <svg height="20px" version="1.1" viewBox="0 0 20 20" width="20px">
      <title />
      <desc />
      <defs />
      <g
        fill="none"
        fillRule="evenodd"
        id="Page-1"
        stroke="none"
        strokeWidth="1"
      >
        <g fill={color} id="Core" transform="translate(-2.000000, -380.000000)">
          <g
            id="remove-circle-outline"
            transform="translate(2.000000, 380.000000)"
          >
            <path
              d="M5,9 L5,11 L15,11 L15,9 L5,9 L5,9 Z M10,0 C4.5,0 0,4.5 0,10 C0,15.5 4.5,20 10,20 C15.5,20 20,15.5 20,10 C20,4.5 15.5,0 10,0 L10,0 Z M10,18 C5.6,18 2,14.4 2,10 C2,5.6 5.6,2 10,2 C14.4,2 18,5.6 18,10 C18,14.4 14.4,18 10,18 L10,18 Z"
              id="Shape"
            />
          </g>
        </g>
      </g>
    </svg>
  </IconWrapper>
);
