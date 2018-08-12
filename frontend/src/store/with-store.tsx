import * as React from "react";
import { Component, StatelessComponent } from "react";
import { store, StoreState } from "@store";

function defaultMapStateToProps(state, props) {
  return {
    ...props,
    ...state,
  };
}

type HigherOrderFactory = (component: typeof Component) => typeof Component;
type MapStateToProps = (state: StoreState, props?: object) => object;

export function withStore(
  WrappedComponent: typeof Component | StatelessComponent,
  mapStateToProps?: MapStateToProps): (...args: HigherOrderFactory[]) => typeof Component {
  class C extends Component<object, StoreState> {
    handleChange: () => void;

    constructor(props) {
      super(props);
      this.state = store.value as StoreState;
      this.handleChange = () => {
        this.setState(store.value);
      };
    }

    componentWillMount() {
      store.onChange(this.handleChange);
    }

    componentWillUnmount() {
      store.offChange(this.handleChange);
    }

    render() {
      return React.createElement(
        WrappedComponent,
        mapStateToProps(this.state, this.props)
      );
    }
  };

  mapStateToProps = mapStateToProps || defaultMapStateToProps;

  return function (...args): typeof Component {
    let wrap: typeof Component = C;
    let n = args.length - 1;

    while (n > -1) {
      wrap = args[n](wrap);
      n -= 1;
    }

    return wrap;
  };
}