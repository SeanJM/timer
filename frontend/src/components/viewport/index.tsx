import React, { Component } from "react";

interface ViewPortProps {
  head?: JSX.Element;
  body: JSX.Element;
  feet?: JSX.Element;
  titlebar?: JSX.Element;
  toolbar?: JSX.Element;
  scopebar?: JSX.Element;
}

export class Viewport extends Component<ViewPortProps> {
  render() {
    const className = ["viewport"];
    if (this.props.head) {
      className.push("viewport--head")
    }

    if (this.props.titlebar) {
      className.push("viewport--titlebar")
    }

    if (this.props.toolbar) {
      className.push("viewport--toolbar")
    }

    if (this.props.scopebar) {
      className.push("viewport--scopebar")
    }

    if (this.props.feet) {
      className.push("viewport--feet")
    }

    return (
      <div className={className.join(" ")}>
        {this.props.head
          ? <div className="viewport_head">{this.props.head}</div>
          : null}
        {this.props.titlebar
          ? <div className="viewport_titlebar">{this.props.titlebar}</div>
          : null}
        {this.props.toolbar
          ? <div className="viewport_toolbar">{this.props.toolbar}</div>
          : null}
        {this.props.scopebar
          ? <div className="viewport_scopebar">{this.props.scopebar}</div>
          : null}
        <div className="viewport_body">{this.props.body}</div>
        {this.props.feet
          ? <div className="viewport_feet">{this.props.feet}</div>
          : null}
      </div>
    );
  }
}