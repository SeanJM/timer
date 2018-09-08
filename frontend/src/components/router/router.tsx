import React, { Fragment, ReactElement } from "react";
import { Route, RouteProps } from "@frontend/components/router/route";
import { withRouter } from "@frontend/components/router/with-router";
import path from "@path";
import getPathname from "@frontend/components/router/get-pathname";
import { WithRouterProps } from "@frontend/components/router";

export interface RouterProps extends Partial<JSX.ElementChildrenAttribute> {}

function routeIsMatch(element: ReactElement<RouteProps>) {
  const { exact } = element.props;
  const pathname = getPathname(window.location.hash.substring(1));
  const params = path.params(pathname, element.props.pathname);
  const show = exact ? params._isExact : params._isMatch;
  return element.props.pathname === "/" ? true : show;
}

const getRoutedComponent =
  (props: WithRouterProps) =>
  (routeElement: ReactElement<RouteProps>, index?: number) => {
  const RoutedComponent = routeElement.props.component;
  const { pathname } = routeElement.props;
  const params = path.params(props.location.pathname, pathname);
  return (
    <RoutedComponent
      key={index}
      history={props.history}
      location={props.location}
      params={params}
      query={props.query}
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

export const Router = withRouter<{}>(RouterView);