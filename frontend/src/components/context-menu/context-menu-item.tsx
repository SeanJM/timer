import React from "react";
import { Icon } from "@frontend/components/icon";

interface ContextMenuItemProps extends Partial<JSX.ElementChildrenAttribute> {
  type?: "select";
  check?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export function ContextMenuItem(props: ContextMenuItemProps) {
  const className = ["context-menu-item"];

  if (props.type === "select") {
    className.push("context-menu-item-select");
  }

  return (
    <li
      className={className.join(" ")}
      onClick={props.onClick}>
      {props.check && props.type === "select"
        ? <span className="context-menu-item_check"><Icon type="check"/></span>
        : null}
      {
        <span className="context-menu-item_text">
          {props.children}
        </span>
      }
    </li>
  );
}