import React, { Component } from "react";

interface TitlebarProps extends Partial<JSX.ElementChildrenAttribute> {
  left?: JSX.Element;
  primaryAction?: JSX.Element;
  secondaryAction?: JSX.Element;
  center?: JSX.Element;
  className?: string;
  onClose?: (e: React.MouseEvent) => void;
}

function Test() {
  return <div></div>;
}

React.createElement(Test);

export class Titlebar extends Component<TitlebarProps> {
  primaryActionNode: HTMLDivElement;
  secondaryActionNode: HTMLDivElement;
  contentNode: HTMLDivElement;

  getNodeWith(node: HTMLElement) {
    return node
      ? node.getBoundingClientRect().width
      : 0;
  }

  componentDidMount() {
    setTimeout(() => {
      const primaryActionWidth =
        this.getNodeWith(this.primaryActionNode);
      const secondaryActionWidth =
        this.getNodeWith(this.secondaryActionNode);
      this.contentNode.setAttribute("style", `
        padding-left: ${primaryActionWidth}px;
        padding-right: ${secondaryActionWidth}px;
      `);
    }, 0);
  }

  render() {
    const className = ["titlebar"];
    const props = this.props;

    if (props.className) {
      className.push(props.className);
    }

    if (props.primaryAction) {
      className.push("titlebar--primary-action");
    }

    if (props.secondaryAction) {
      className.push("titlebar--secondary-action");
    }

    if (props.left) {
      className.push("titlebar--left");
    }

    return (
      <div className={className.join(" ")}>
        <div
          ref={(node) => { this.contentNode = node; }}
          className="titlebar_content"
        >
          {props.left
            ? (
              <div className="titlebar_left">
                {props.left}
              </div>
            )
            : null}
          {props.center
            ? (
              <div className="titlebar_center">
                {props.center}
              </div>
            )
            : null}
          {props.primaryAction
            ? (
              <div
                ref={(node) => { this.primaryActionNode = node; }}
                className="titlebar_primary-action"
              >
                {props.primaryAction}
              </div>
            )
            : null}
          {props.secondaryAction
            ? (
              <div
                ref={(node) => { this.secondaryActionNode = node; }}
                className="titlebar_secondary-action"
              >
                {props.secondaryAction}
              </div>
            )
            : null}
          {props.children}
        </div>
      </div>
    );
  }
}