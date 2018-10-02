import React from "react";
import { history } from "./history";

export interface LinkProps extends Partial<JSX.ElementChildrenAttribute> {
  className?: string;
  to?: string;
  href?: string;
  query?: string;
}

export function Link(props: LinkProps) {
  return (
    <a
      onClick={() => {
        if (props.query) {
          history.push({
            search: props.query
          });
        }
      }}
      className={props.className}
      href={props.to ? "#" + props.to : props.href}>
      {props.children}
    </a>
  );
}