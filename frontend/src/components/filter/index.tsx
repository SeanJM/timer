import React, { Fragment } from "react";
import curry from "@curry";

interface FilterProps extends Partial<JSX.ElementChildrenAttribute> {
  id?: string;
  className?: string;
  name?: string;
  action?: string;
  value?: string;
  [key: string]: any;
}

function isVisible(props: FilterProps, child: JSX.Element): boolean {
  for (var k in props) {
    if (props[k] !== child.props[k]) {
      return false;
    }
  }
  return true;
}

export function Filter(props: FilterProps) {
  const children = React.Children.toArray(props.children);
  return (
    <Fragment>
      {children.filter(curry(isVisible, props))}
    </Fragment>
  );
}