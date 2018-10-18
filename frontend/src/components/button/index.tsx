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
  toggle?: boolean;
  variant?: ButtonType;
}

interface ButtonState {
  active?: boolean;
}

export class Button extends React.Component<ButtonProps, ButtonState> {
  node: HTMLSpanElement;

  constructor(props) {
    super(props);
    this.state = {
      active: this.props.active || false,
    };
  }

  componentDidMount() {
    if (this.props.autofocus) {
      this.node.focus();
    }
  }

  buttonDidKeyDown(e: React.KeyboardEvent) {
    const { onClick } = this.props;
    if (e.which === 13 && onClick) {
      this.setState({
        active: true
      });
    }
  }

  buttonDidKeyUp(e: React.KeyboardEvent) {
    const { onClick } = this.props;
    if (e.which === 13 && onClick) {
      onClick(e);
    }
  }

  render() {
    const { onClick, variant, icon, className, toggle } = this.props;
    const { active } = this.state;
    const classList = ["button"];

    if (variant) {
      classList.push("button--" + variant);
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

    if (toggle) {
      classList.push("button--toggle");
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
        onKeyUp={(e) => this.buttonDidKeyUp(e)}
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