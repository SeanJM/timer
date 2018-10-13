import * as React from "react";
import { Icon, IconType } from "@frontend/components/icon";

export type ButtonType =
  | "primary"
  | "positive"
  | "negative"
  | "danger";

interface ButtonProps extends Partial<JSX.ElementChildrenAttribute> {
  onClick?: (event: React.MouseEvent) => void;
  active?: boolean;
  className?: string;
  icon?: IconType;
  type?: ButtonType;
}

export function Button(props: ButtonProps) {
  const { onClick } = props;
  const classList = ["button"];

  if (props.type) {
    classList.push("button--" + props.type);
  }

  if (props.children) {
    classList.push("button-text");
  }

  if (props.icon) {
    classList.push("button-icon");
  }

  if (props.active) {
    classList.push("button-active");
  }

  if (props.className) {
    classList.push(props.className);
  }

  return (
    <span
      className={classList.join(" ")}
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