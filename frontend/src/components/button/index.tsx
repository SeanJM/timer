import * as React from "react";
import { Icon, IconType } from "@frontend/components/icon";

type ButtonType =
  | "primary"
  | "positive"
  | "negative"
  | "danger";

interface ButtonProps extends Partial<JSX.ElementChildrenAttribute> {
  onClick?: (event: React.MouseEvent) => void;
  type?: ButtonType;
  icon?: IconType;
}

export function Button(props: ButtonProps) {
  const { onClick } = props;
  const className = ["button"];

  if (props.type) {
    className.push("button--" + props.type);
  }

  if (props.children) {
    className.push("button-text");
  }

  if (props.icon) {
    className.push("button-icon");
  }

  return (
    <span
      className={className.join(" ")}
      onClick={(e) => onClick && onClick(e)}
    >
      {props.icon ? <Icon type={props.icon} /> : null}
      {props.children
        ? <span className="button_text">{props.children}</span>
        : null}
      <span className="button_face" />
    </span>
  );
}