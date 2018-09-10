import React, { Fragment, ReactElement } from "react";
import { Route, RouteProps } from "@frontend/components/router/route";
import { withRouter } from "@frontend/components/router/with-router";
import path from "@path";
import getPathname from "@frontend/components/router/get-pathname";
import { WithRouterProps } from "@frontend/components/router";

export interface RouterIncomingProps {
  basename?: string;
  notfound?: React.ComponentType;
}

type RouterProps = WithRouterProps & RouterIncomingProps;
type RouteElement = ReactElement<RouteProps>;

function getRoutePathname(baseurl: string, pathname: string) {
  return baseurl ? path.join(baseurl, pathname) : pathname;
}

const routeIsMatch = (routerProps: RouterProps) => (element: RouteElement) => {
  const { exact } = element.props;
  const pathname = getPathname(window.location.hash.substring(1));
  const routePathname = getRoutePathname(routerProps.basename, element.props.pathname);
  const params = path.params(pathname, routePathname);
  const show = exact ? params._isExact : params._isMatch;
  return routePathname === "/" ? true : show;
};

const getRoutedComponent =
  (routerProps: RouterProps) =>
  (routeElement: RouteElement, index?: number) => {
    const RoutedComponent =
      routeElement.props.component;

    const routePathname =
      getRoutePathname(routerProps.basename, routeElement.props.pathname);

    const params =
      path.params(routerProps.location.pathname, routePathname);

    return (
      <RoutedComponent
        key={index}
        history={routerProps.history}
        location={routerProps.location}
        params={params}
        query={routerProps.query}
      />
    );
  };

export function RouterView(props: WithRouterProps) {
  const routes = React.Children.toArray(props.children).filter((element) => {
    return (element as JSX.Element).type === Route;
  }) as RouteElement[];

  const partialGetRouted = getRoutedComponent(props);
  const partialIsMatch = routeIsMatch(props);
  const displayedRoutes = routes.filter(partialIsMatch).map(partialGetRouted);

  return (
    <Fragment>
      {displayedRoutes}
    </Fragment>
  );
}

/**
 * Router
 * ---
 * The router view controls how its children (Route) are displayed
 * it has an optional 'baseurl' property so that routers can be
 * more modular
 */
export const Router = withRouter<RouterIncomingProps>(RouterView);