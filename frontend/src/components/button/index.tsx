import * as React from "react";

type ButtonType =
  | "primary"
  | "danger";

interface ButtonProps extends JSX.ElementChildrenAttribute {
  onClick?: (event: React.MouseEvent) => void;
  type?: ButtonType;
}

export function Button(props: ButtonProps) {
  const { onClick } = props;
  const className = ["button"];

  if (props.type) {
    className.push("button--" + props.type);
  }

  return (
    <span
      className={className.join(" ")}
      onClick={(e) => onClick && onClick(e)}
    >
      <span className="button_text">{props.children}</span>
      <span className="button_face" />
    </span>
  );
}