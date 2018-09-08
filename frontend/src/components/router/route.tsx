import { PathParams, PathQueryValue } from "@path";
import { RouterHistory, RouterLocation } from "@frontend/components/router";
import React, { Fragment } from "react";

export interface RouteComponentProps {
  history: RouterHistory;
  location: RouterLocation;
  params: PathParams;
  query: PathQueryValue;
}

export interface RouteProps {
  component: React.ComponentType<Partial<RouteComponentProps>>;
  pathname?: string;
  exact?: boolean;
}

export function Route(props: RouteProps) {
  return <Fragment/>;
}