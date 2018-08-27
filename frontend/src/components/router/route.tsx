import React, { Fragment } from "react";
import history, { History } from "@frontend/components/router/history";
import path, { Params } from "@path";
import { RouterLocation } from "@frontend/components/router";

type AnyComponent = React.ComponentClass;

export interface RouteProps extends Partial<JSX.ElementChildrenAttribute> {
  pathname: string;
  exact?: boolean;
  component?: AnyComponent;
  location?: RouterLocation;
  filter?: (location: RouterLocation) => boolean;
}

export interface RouterProps {
  history: History,
  params: Params,
  location: RouterLocation,
}

export function Route(props: RouteProps) {
  const C = props.component;
  const location = history.last();
  const params = path.params(location.pathname, props.pathname);
  return (
    <Fragment>
      {C
        ? React.createElement<RouterProps>(C as React.ComponentClass<RouterProps>, {
          history: history,
          params: params,
          location: location,
        })
        : null}
      {props.children}
    </Fragment>
  );
}