import React from "react";
import history, { History } from "@components/router/history";
import getLocation from "@components/router/get-location";
import path, { Params } from "@path";
import { RouterLocation } from "@components/router/types";

interface WithRouterProps {
  pathname?: string;
  exact?: boolean;
}

export interface WithRouterComponentProps extends Partial<JSX.ElementChildrenAttribute> {
  history: History;
  location: Partial<RouterLocation>;
  params: Partial<Params>;
}

interface State {
  params: Partial<Params>;
  location: Partial<RouterLocation>
};

export function withRouter<P extends WithRouterComponentProps>(C: React.ComponentType<P>) {
  return class extends React.Component<WithRouterProps, State> {
    update: () => void;

    constructor(props) {
      super(props);
      this.state = {
        params: {},
        location: {}
      };
    }

    componentDidMount() {
      this.update = () => {
        const location = getLocation(window.location.hash.substring(1));
        let params = path.params(location.pathname, this.props.pathname);
        this.setState({
          params,
          location,
        });
      };

      window.addEventListener("hashchange", this.update);
      this.update();
    }

    componentWillUnmount() {
      window.removeEventListener("hashchange", this.update);
    }

    render() {
      const props = {
        ...this.props,
        history,
        location: this.state.location,
        params: this.state.params,
      };
      return (
        <C {...props}>
          {this.props.children}
        </C>
      );
    }
  }
};