import React from "react";

export interface LinkProps {
  className?: string,
  to?: string,
  href?: string,
  children?: JSX.Element,
}

export function Link(props: LinkProps) {
  return (
    <a
      className={props.className}
      href={props.to ? "#" + props.to : props.href}>
      {props.children}
    </a>
  );
}