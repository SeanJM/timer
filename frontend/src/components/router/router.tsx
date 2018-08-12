import React, { Fragment } from "react";
import { Route } from "@components/router/route";
import { withRouter } from "@components/router/with-router";
import getParams from "@components/router/get-params";
import getPathname from "@components/router/get-pathname";
import { WithRouterComponentProps } from "@components/router";

function routeIsMatch(props) {
  const { exact } = props;
  const pathname = getPathname(window.location.hash.substring(1));
  const params = getParams(pathname, props.pathname);
  return exact ? params.__exact : params.__match;
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