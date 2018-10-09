import React from "react";

interface ListActionProps extends JSX.ElementChildrenAttribute {
  onClick?: (e: React.MouseEvent) => void;
  type?: "danger" | "primary";
}

export function ListAction(props: ListActionProps) {
  const classList = ["list-action"];

  if (props.type) {
    classList.push("list-action--" + props.type);
  }

  return (
    <span className={classList.join(" ")} onClick={props.onClick}>{props.children}</span>
  );
}