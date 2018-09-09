import * as React from "react";

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

export function Titlebar(props: TitlebarProps) {
  const className = ["titlebar"];

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
      <div className="titlebar_content">
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
            <div className="titlebar_primary-action">
              {props.primaryAction}
            </div>
          )
          : null}
        {props.secondaryAction
          ? (
            <div className="titlebar_secondary-action">
              {props.secondaryAction}
            </div>
          )
          : null}
        {props.children}
      </div>
    </div>
  );
}