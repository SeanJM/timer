import React from "react";
import { Button, ButtonType } from "@components/button";
import { Icon } from "@components/icon";

interface ButtonConfirmProps {
  children: JSX.ElementChildrenAttribute["children"];
  onClick?: (e: React.MouseEvent) => void;
  type: ButtonType;
}

interface ButtonConfirmState {
  showSelect: boolean;
}

export class ButtonConfirm extends React.Component<ButtonConfirmProps, ButtonConfirmState> {
  constructor(props) {
    super(props);
    this.state = {
      showSelect: false
    };
  }

  render() {
    const { onClick } = this.props;
    const classList = [ "button-confirm" ];

    if (this.state.showSelect) {
      classList.push("button-confirm--show-select");
    }

    return (
      <div
        className={classList.join(" ")}
      >
        {!this.state.showSelect
          ? <div
            className="button-confirm_click-capture"
            onClick={() => this.setState({ showSelect: true })}
          />
          : null}
        <Button type={this.props.type}>{this.props.children}</Button>
        <div className="button-confirm_select">
          <div
            className="button-confirm_affirmative"
            onClick={(e) => {
            if (onClick) {
              onClick(e);
            }
          }}>
            <Icon type="check"/>
          </div>
          <div
            className="button-confirm_negative"
            onClick={(e) => {
              this.setState({ showSelect: false });
            }}
          >
            <Icon type="close"/>
          </div>
        </div>
      </div>
    );
  }
}