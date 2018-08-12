import React, { Fragment } from "react";
import history, { History } from "@components/router/history";
import getParams, { Params } from "@components/router/get-params";
import { RouterLocation } from "@components/router";

type AnyComponent = React.ComponentClass;

interface RouteProps extends Partial<JSX.ElementChildrenAttribute> {
  pathname: string;
  exact?: boolean;
  component?: AnyComponent;
  location?: RouterLocation;
}

export interface RouterProps {
  history: History,
  params: Params,
  location: RouterLocation,
}

export function Route(props: RouteProps) {
  const C = props.component;
  const location = history.last();
  const params = getParams(location.pathname, props.pathname);
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