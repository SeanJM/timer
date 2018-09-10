import React from "react";
import { Link } from "@frontend/components/router";

interface ListProps extends Partial<JSX.ElementChildrenAttribute> {

}

interface ListItemProps extends Partial<JSX.ElementChildrenAttribute> {
  primaryAction?: JSX.Element;
  control?: JSX.Element;
  timestamp?: JSX.Element;
  body?: JSX.Element;
  feet?: JSX.Element;
  to?: string;
  title?: string | number;
  passive?: boolean;
  isActive?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export function List(props: ListProps) {
  return (<div className="list">{props.children}</div>);
}

export function ListItem(props: ListItemProps) {
  const className = ["list-item"];

  if (props.primaryAction) {
    className.push("list-item-primary-action");
  }

  if (props.control) {
    className.push("list-item-secondary-action");
  }

  if (props.timestamp) {
    className.push("list-item-timestamp");
  }

  if (props.passive) {
    className.push("list-item-passive");
  }

  if (props.isActive) {
    className.push("list-item--active");
  }

  return (
    <div className={className.join(" ")}>
      {props.to
        ? <Link className="list-item_link" to={props.to} />
        : props.onClick
          ? <div className="list-item_link" onClick={props.onClick} />
          : null}
      {props.control
        ? <div className="list-item_control">{props.control}</div>
        : null}
      {props.title
        ? <div className="list-item_title"><h6>{props.title}</h6></div>
        : null}
      {props.timestamp
        ? <div className="list-item_timestamp">{props.timestamp}</div>
        : null}
      {props.body
        ? <div className="list-item_body">{props.body}</div>
        : null}
      {props.feet
        ? <div className="list-item_feet">{props.feet}</div>
        : null}
      {props.primaryAction
        ? <div className="list-item_primary-action">{props.primaryAction}</div>
        : null}
      {props.children}
    </div>
  );
}