import React, { Fragment } from "react";
import { Route, RouteProps } from "@frontend/components/router/route";
import { withRouter } from "@frontend/components/router/with-router";
import path from "@path";
import getPathname from "@frontend/components/router/get-pathname";
import { WithRouterComponentProps } from "@frontend/components/router";

function routeIsMatch(props: RouteProps) {
  const { exact, filter } = props;
  const pathname = getPathname(window.location.hash.substring(1));
  const params = path.params(pathname, props.pathname);
  const show = exact ? params.__exact : params.__match;
  return show && filter ? filter(props.location) : show;
}

interface RouterProps extends Partial<WithRouterComponentProps> {
}

export function RouterView(props: RouterProps) {
  const routes = React.Children.toArray(props.children).filter((element) => {
    return (element as JSX.Element).type === Route;
  });

  const displayedRoutes = routes
    .filter((element) => {
      return routeIsMatch((element as JSX.Element).props);
    })
    .map((element) => React.cloneElement(element as JSX.Element, {
      history: props.history,
      location: props.location,
      params: props.params,
    }));

  return (
    <Fragment>
      {displayedRoutes.length
        ? displayedRoutes
        : routes.slice(-1)[0]
      }
    </Fragment>
  );
}

export const Router = withRouter(RouterView);