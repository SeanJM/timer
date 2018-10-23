import path from "@path";
import React from "react";
import { PathQueryValue } from "@path/query";

import { history } from "@components/router/history";
import { RouterLocation } from "./types";
import { History } from "./class/history";

export interface WithRouterProps extends
  Partial<JSX.ElementChildrenAttribute>
  {
    history: History;
    location: RouterLocation;
    query: PathQueryValue;
  }

interface State extends Pick<WithRouterProps, "location" | "query"> {}

export function withRouter<P extends {}>(C: React.ComponentType<P>) {
  return class extends React.Component<P, State> {
    constructor(props) {
      const location = history.getLocation(window.location.hash.substring(1));
      super(props);
      this.state = {
        location,
        query: path.query(location.search).value
      };
    }

    handleEvent(e: History.ChangeEvent) {
      this.setState({
        location: {
          hash: e.hash,
          href: e.href,
          pathname: e.pathname,
          search: e.search,
        },
        query: e.query,
      });
    }

    componentDidMount() {
      history.onChange(this);
    }

    componentWillUnmount() {
      history.offChange(this);
    }

    render() {
      const props = Object.assign({}, this.props, this.state, { history });
      return (
        <C {...props}>
          {this.props.children}
        </C>
      );
    }
  };
}