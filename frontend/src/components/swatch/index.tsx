import React from "react";

export interface SwatchProps extends Partial<JSX.ElementChildrenAttribute> {
  onClick?: () => void;
  background?: string;
  isSelected?: boolean;
  className?: string;
}

export default function Swatch(props: SwatchProps) {
  const className = ["swatch"];

  if (props.isSelected) {
    className.push("swatch-select");
  }

  if (props.className) {
    className.push(props.className);
  }

  return (
    <div
      onClick={props.onClick}
      className={className.join(" ")}
    >
      <div style={{background: props.background}} className="swatch_color"></div>
      <div className="swatch_face"></div>
      <div className="swatch_select"></div>
      {props.children}
    </div>
  );
}