import * as React from "react";

interface Props extends Partial<JSX.ElementChildrenAttribute> {
  className?: string;
}

export default function Control(props: Props) {
  const className = ["control"];

  if (props.className) {
    className.push(props.className);
  }

  return (
    <div className={className.join(" ")}>{props.children}</div>
  );
}