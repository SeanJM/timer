import React, { Fragment, ReactElement } from "react";
import { Route, RouteProps } from "@frontend/components/router/route";
import { withRouter } from "@frontend/components/router/with-router";
import path from "@path";
import getPathname from "@frontend/components/router/get-pathname";
import { WithRouterProps } from "@frontend/components/router";

export interface RouterProps {
  baseurl?: string;
}

interface MergedRouterProps extends WithRouterProps, RouterProps {}

function routeIsMatch(element: ReactElement<RouteProps>) {
  const { exact } = element.props;
  const pathname = getPathname(window.location.hash.substring(1));
  const params = path.params(pathname, element.props.pathname);
  const show = exact ? params._isExact : params._isMatch;
  return element.props.pathname === "/" ? true : show;
}

const getRoutedComponent =
  (routerProps: MergedRouterProps) =>
  (routeElement: ReactElement<RouteProps>, index?: number) => {
    const RoutedComponent =
      routeElement.props.component;

    const pathname = routerProps.baseurl
      ? path.join(routerProps.baseurl, routeElement.props.pathname)
      : routeElement.props.pathname;

    const params =
      path.params(routerProps.location.pathname, pathname);

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
  }) as ReactElement<RouteProps>[];

  const partialGetRouted = getRoutedComponent(props);
  const displayedRoutes = routes.filter(routeIsMatch).map(partialGetRouted);

  return (
    <Fragment>
      {displayedRoutes.length
        ? displayedRoutes
        : partialGetRouted(routes.slice(-1)[0])
      }
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
export const Router = withRouter<RouterProps>(RouterView);