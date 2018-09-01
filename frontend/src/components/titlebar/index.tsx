import * as React from "react";

interface TitlebarProps extends Partial<JSX.ElementChildrenAttribute> {
  left?: JSX.Element;
  right?: JSX.Element;
  center?: JSX.Element;
  className?: string;
  onClose?: (e: React.MouseEvent) => void
}

function Test() {
  return <div></div>;
}

React.createElement(Test);

export default function Titlebar(props: TitlebarProps) {
  const className = ["titlebar"];

  if (props.className) {
    className.push(props.className);
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
        {props.right
          ? (
            <div className="titlebar_right">
              {props.right}
            </div>
          )
          : null}
        {props.children}
      </div>
    </div>
  );
}