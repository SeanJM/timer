import React, { Fragment } from "react";
import { withStore, StoreState } from "@frontend/store";
import SlideOutTodo from "@frontend/containers/slide-out-todo";
import { withRouter, RouterProps } from "@frontend/components/router";
import { Viewport } from "@frontend/components/viewport";
import path from "@path";
import anime from "animejs";

const BY_TYPE: {
  [key: string]: React.ComponentType
} = {
  "TODO": SlideOutTodo as React.ComponentType
};


interface ServiceProps extends
  Partial<StoreState["slideOut"]>,
  Pick<RouterProps, "history" | "location"> {
  history: RouterProps["history"]
}

interface SlideOutProps {
  titlebar?: JSX.Element;
  body?: JSX.Element;
}

function mapStateToProps(state: StoreState, props: RouterProps): ServiceProps {
  return {
    type: state.slideOut.type,
    value: state.slideOut.value,
    history: props.history,
    location: props.location,
  };
}

export function SlideOut(props: SlideOutProps) {
  return (
    <div className="slide-out">
      <Viewport
        titlebar={ props.titlebar }
        body={ props.body }
      />
    </div>
  );
}

export class SlideOutView extends React.Component<ServiceProps, {}> {
  shadowbox: HTMLDivElement;
  chrome: HTMLDivElement;

  componentDidMount() {
    anime({
      targets: this.shadowbox,
      opacity: [0, 1],
      easing: "easeOutQuad",
      duration: 600,
    });

    anime({
      targets: this.chrome,
      translateX: [this.chrome.getBoundingClientRect().width, 0],
      easing: "easeOutQuad",
      duration: 300,
    });
  }

  render() {
    const history = this.props.history;
    const location = this.props.location;
    return (
      <div className="slide-out-container">
        <div
          ref={(node) => { this.shadowbox = node; }}
          className="slide-out-container_shadowbox"
          onClick={() => history.push(path.pop(location.pathname))}
        />
        <div
          ref={(node) => { this.chrome = node; }}
          className="slide-out-container_chrome"
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}

export function SlideOutServiceView(props: ServiceProps) {
  const SlideOutElement = BY_TYPE[props.type];
  return (
    <Fragment>
      {SlideOutElement
        ? (
          <SlideOutView {...props}>
            {<SlideOutElement {...props.value} />}
          </SlideOutView>)
        : null}
    </Fragment>
  );
}

export const SlideOutContainerConnect =
  withStore(SlideOutServiceView as React.ComponentType, mapStateToProps)(withRouter);