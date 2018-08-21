import React from "react";
import { Link } from "@components/router";

interface ListProps extends Partial<JSX.ElementChildrenAttribute> {

}

interface ListItemProps extends Partial<JSX.ElementChildrenAttribute> {
  primaryAction?: JSX.Element;
  secondaryAction?: JSX.Element;
  timestamp?: JSX.Element;
  body?: JSX.Element;
  feet?: JSX.Element;
  to?: string;
  title?: string | number;
  passive?: boolean;
}

export function List(props: ListProps) {
  return (<div className="list">{props.children}</div>);
}

export function ListItem(props: ListItemProps) {
  const className = ["list-item"];

  if (props.primaryAction) {
    className.push("list-item-primary-action");
  }

  if (props.secondaryAction) {
    className.push("list-item-secondary-action");
  }

  if (props.timestamp) {
    className.push("list-item-timestamp");
  }

  if (props.passive) {
    className.push("list-item-passive");
  }

  return (
    <div className={className.join(" ")}>
      {props.to
        ? <Link className="list-item_link" to={props.to} />
        : null}
      {props.primaryAction
        ? <div className="list-item_primary-action">{props.primaryAction}</div>
        : null}
      {props.secondaryAction
        ? <div className="list-item_secondary-action">{props.primaryAction}</div>
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
      {props.children}
    </div>
  );
}