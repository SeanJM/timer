import React from "react";
import { history, RouterHistory } from "@frontend/components/router/history";
import getLocation from "@frontend/components/router/get-location";
import path from "@path";
import { RouterLocation } from "@frontend/components/router/types";
import { PathQueryValue } from "@path/query";

export interface WithRouterProps extends
  Partial<JSX.ElementChildrenAttribute>
  {
    location: RouterLocation;
    query: PathQueryValue;
    history: RouterHistory;
  }

interface State extends Pick<WithRouterProps, "location" | "query"> {}

export function withRouter<P extends {}>(C: React.ComponentType<P>) {
  return class extends React.Component<P, State> {
    constructor(props) {
      const location = getLocation(window.location.hash.substring(1));
      super(props);
      this.state = {
        location,
        query: path.query(location.search).value
      };
    }

    handleEvent() {
      const location = getLocation(window.location.hash.substring(1));
      let query = path.query(location.search).value;
      this.setState({
        location,
        query,
      });
    }

    componentDidMount() {
      window.addEventListener("hashchange", this);
    }

    componentWillUnmount() {
      window.removeEventListener("hashchange", this);
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