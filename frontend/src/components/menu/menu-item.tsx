import React from "react";

interface Props {
  title: string;
  isSelected?: boolean;
  className?: string;
  control?: JSX.Element;
  onClick?: (e: React.MouseEvent) => void;
}

export function MenuItem(props: Props) {
  const className = ["menu-item"];

  if (props.className) {
    className.push(props.className);
  }

  if (props.control) {
    className.push("menu-item-control");
  }

  if (props.isSelected) {
    className.push("menu-item--selected");
  }

  return (
    <div
      className={className.join(" ")}
    >
      {props.title
        ? <div className="menu-item_title">{props.title}</div>
        : null}
      {props.control
        ? <div className="menu-item_control">{props.control}</div>
        : null}
      <div className="menu-item_click-target" onClick={props.onClick} />
    </div>
  );
}