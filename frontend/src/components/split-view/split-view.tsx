import React from "react";

class SplitView extends React.Component<SplitView.Props> {
  render() {
    return (
      <div className="split-view">
        <div className="split-view_left">
          <div className="split-view_left-content">
            {this.props.left}
          </div>
        </div>
        <div className="split-view_right">
          <div className="split-view_right-content">
            {this.props.right}
          </div>
        </div>
      </div>
    );
  }
}

namespace SplitView {
  export interface Props {
    left: JSX.Element;
    right: JSX.Element;
  }
}

export { SplitView };