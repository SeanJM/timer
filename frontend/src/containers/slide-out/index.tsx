import React, { Fragment } from "react";
import { withStore, StoreState } from "@store";
import SlideOutTodo from "@containers/slide-out-todo";
import { withRouter, RouterProps } from "@components/router";
import path from "@path";
import anime from "animejs";

const BY_TYPE: {
  [key: string]: React.ComponentType
} = {
  "TODO": SlideOutTodo as React.ComponentType
};


interface Props extends
  Partial<StoreState["slideOut"]>,
  Pick<RouterProps, "history" | "location"> {
  history: RouterProps["history"]
}

function mapStateToProps(state: StoreState, props: RouterProps): Props {
  return {
    type: state.slideOut.type,
    value: state.slideOut.value,
    history: props.history,
    location: props.location,
  };
}

export class SlideOut extends React.Component<Props, {}> {
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
      <div className="slide-out">
        <div
          ref={(node) => { this.shadowbox = node; }}
          className="slide-out_shadowbox"
          onClick={() => history.push(path.pop(location.pathname))}
        />
        <div
          ref={(node) => { this.chrome = node; }}
          className="slide-out_chrome"
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}

export function SlideOutContainerView(props: Props) {
  const SlideOutElement = BY_TYPE[props.type];
  return (
    <Fragment>
      {SlideOutElement
        ? (
          <SlideOut {...props}>
            {<SlideOutElement {...props.value} />}
          </SlideOut>)
        : null}
    </Fragment>
  );
}

export const SlideOutContainerConnect =
  withStore(SlideOutContainerView as React.ComponentType, mapStateToProps)(withRouter);