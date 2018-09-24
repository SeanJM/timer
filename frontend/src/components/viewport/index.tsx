import React, { Component } from "react";

interface ViewPortProps {
  head?: JSX.Element;
  body: JSX.Element;
  feet?: JSX.Element;
  titlebar?: JSX.Element;
  toolbar?: JSX.Element;
  scopebar?: JSX.Element;
  className?: string;
}

export class Viewport extends Component<ViewPortProps> {
  render() {
    const classList = ["viewport"];
    const {
      body,
      className,
      feet,
      head,
      scopebar,
      titlebar,
      toolbar,
    } = this.props;

    if (head) {
      classList.push("viewport--head");
    }

    if (titlebar) {
      classList.push("viewport--titlebar");
    }

    if (toolbar) {
      classList.push("viewport--toolbar");
    }

    if (scopebar) {
      classList.push("viewport--scopebar");
    }

    if (feet) {
      classList.push("viewport--feet");
    }

    if (className) {
      classList.push(className);
    }

    return (
      <div className={classList.join(" ")}>
        {head
          ? <div className="viewport_head">{head}</div>
          : null}
        {titlebar
          ? <div className="viewport_titlebar">{titlebar}</div>
          : null}
        {toolbar
          ? <div className="viewport_toolbar">{toolbar}</div>
          : null}
        {scopebar
          ? <div className="viewport_scopebar">{scopebar}</div>
          : null}
        <div className="viewport_body">{body}</div>
        {feet
          ? <div className="viewport_feet">{feet}</div>
          : null}
      </div>
    );
  }
}