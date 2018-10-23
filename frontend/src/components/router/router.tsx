import React from "react";
import { withRouter } from "@frontend/components/router/with-router";
import { WithRouterProps } from "@frontend/components/router";
export const RouterContext = React.createContext<RouterProps>({} as RouterProps);

export interface RouterIncomingProps {
  basename?: string;
  notfound?: React.ComponentType;
}

export type RouterProps = WithRouterProps & RouterIncomingProps;

export function RouterView(props: RouterProps) {
  return (
    <RouterContext.Provider value={{...props}}>
      {props.children}
    </RouterContext.Provider>
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