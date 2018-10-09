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

interface ViewPortState {
  bodyOverflow: boolean;
}

export class Viewport extends Component<ViewPortProps, ViewPortState> {
  bodyNode: HTMLDivElement;
  bodyContentNode: HTMLDivElement;
  bodyOverflowChecker: any;

  constructor(props) {
    super(props);
    this.state = {
      bodyOverflow: false
    };
  }

  componentWillUnmount() {
    clearTimeout(this.bodyOverflowChecker);
  }

  componentDidMount() {
    const checker = () => {
      const { bodyOverflow } = this.state;
      const bodyContentNodeOffset = this.bodyContentNode.getBoundingClientRect();
      const bodyNodeOffset = this.bodyNode.getBoundingClientRect();
      const isBiggerThan = bodyContentNodeOffset.height > bodyNodeOffset.height;

      if (isBiggerThan && !bodyOverflow) {
        this.setState({
          bodyOverflow: true
        });
      } else if (!isBiggerThan && bodyOverflow) {
        this.setState({
          bodyOverflow: false
        });
      }

      this.bodyOverflowChecker = setTimeout(checker, 200);
    };

    checker();
  }

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

    if (this.state.bodyOverflow) {
      classList.push("viewport--body-overflow");
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
        <div
          ref={(node) => { this.bodyNode = node; }}
          className="viewport_body">
          <div
            ref={(node) => { this.bodyContentNode = node; }}
            className="viewport_body_content">
            {body}
          </div>
        </div>
        {feet
          ? <div className="viewport_feet">{feet}</div>
          : null}
      </div>
    );
  }
}