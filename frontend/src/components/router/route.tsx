import React from "react";
import path, { PathParams, PathQueryValue } from "@path";
import { History } from "./class/history";
import { RouterContext, RouterProps } from "./router";
import { RouterLocation } from "@frontend/components/router";

export interface RouteComponentProps {
  history: History;
  location: RouterLocation;
  params: PathParams;
  query: PathQueryValue;
}

export interface RouteProps {
  component: React.ComponentType<Partial<RouteComponentProps>>;
  pathname?: string;
  exact?: boolean;
}

function getRoutePathname(baseurl: string, pathname: string) {
  return baseurl ? path.join(baseurl, pathname) : pathname;
}

const routeIsMatch = (routerProps: RouterProps, props: RouteProps) => {
  const { exact } = props;
  const pathname = path.pathname(window.location.hash.substring(1));
  const routePathname = getRoutePathname(routerProps.basename, props.pathname);
  const params = path.params(pathname, routePathname);
  const show = exact ? params._isExact : params._isMatch;
  return routePathname === "/" ? true : show;
};

const getRoutedComponent = (routerProps: RouterProps, props: RouteProps) => {
    const RoutedComponent =
      props.component;

    const routePathname =
      getRoutePathname(routerProps.basename, props.pathname);

    const params =
      path.params(routerProps.location.pathname, routePathname);

    return (
      <RoutedComponent
        history={routerProps.history}
        location={routerProps.location}
        params={params}
        query={routerProps.query}
      />
    );
  };

export function Route(props: RouteProps) {
  return (
    <RouterContext.Consumer>
      {(routerProps) => {
        if (routeIsMatch(routerProps, props)) {
          return getRoutedComponent(routerProps, props);
        }
        return null;
      }}
    </RouterContext.Consumer>
   );
}