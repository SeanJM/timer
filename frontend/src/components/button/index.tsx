import * as React from "react";
import { Icon, IconType } from "@frontend/components/icon";

export type ButtonType =
  | "primary"
  | "positive"
  | "negative"
  | "danger";

interface ButtonProps extends Partial<JSX.ElementChildrenAttribute> {
  active?: boolean;
  autofocus?: boolean;
  className?: string;
  icon?: IconType;
  onClick?: (event: React.MouseEvent | React.KeyboardEvent) => void;
  type?: ButtonType;
}

export class Button extends React.Component<ButtonProps> {
  node: HTMLSpanElement;

  componentDidMount() {
    if (this.props.autofocus) {
      this.node.focus();
    }
  }

  buttonDidKeyDown(e: React.KeyboardEvent) {
    const { onClick } = this.props;
    if (e.which === 13 && onClick) {
      onClick(e);
    }
  }

  render() {
    const { onClick, type, icon, active, className } = this.props;
    const classList = ["button"];

    if (type) {
      classList.push("button--" + type);
    }

    if (this.props.children) {
      classList.push("button-text");
    }

    if (icon) {
      classList.push("button-icon");
    }

    if (active) {
      classList.push("button--active");
    }

    if (className) {
      classList.push(className);
    }

    return (
      <span
        ref={(node) => { this.node = node; }}
        className={classList.join(" ")}
        onClick={(e) => onClick && onClick(e)}
        onKeyDown={(e) => this.buttonDidKeyDown(e)}
        tabIndex={0}
      >
        {icon ? <Icon type={icon} /> : null}
        {this.props.children
          ? <span className="button_text">{this.props.children}</span>
          : null}
        <span className="button_face" />
      </span>
    );
  }
}