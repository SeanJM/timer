import React from "react";

export interface DropdownItemProps {
  children: string;
  id?: string;
  selected?: boolean;

  onMouseEnter?: (e: React.MouseEvent) => void;
  onClick?: (e: React.MouseEvent) => void;
}

export function DropdownItem(props: DropdownItemProps) {
  const classList = ["dropdown-item"];

  if (props.selected) {
    classList.push("dropdown-item--selected");
  }

  return (
    <div
      className={classList.join(" ")}
      onMouseEnter={props.onMouseEnter}
      onClick={props.onClick}
     >
      <div className="dropdown-item_select"/>
      <div className="dropdown-item_text">{props.children}</div>
    </div>
  );
}