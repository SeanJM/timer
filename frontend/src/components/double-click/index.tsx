import React from "react";

class DoubleClick extends React.Component<DoubleClick.Props> {
  clickCount: number;
  clickTimeout: any;
  clickDelay: number;

  constructor(props) {
    super(props);
    this.clickCount = 0;
    this.clickDelay = 200;
  }

  onClick(e: React.MouseEvent) {
    const { onClick } = this.props.children.props;
    this.clickCount += 1;

    if (onClick) {
      onClick(e);
    }

    if (this.clickCount === 2) {
      this.clickCount = 0;
      this.props.onDoubleClick(e);
    }

    clearTimeout(this.clickTimeout);
    this.clickTimeout =
      setTimeout(() => this.clickCount = 0, this.clickDelay);
  }

  render() {
    const classList = [];

    if (this.props.className) {
      classList.push(this.props.className);
    }

    return (
      <div
        className={classList.join(" ")}
        onClick={(e) => this.onClick(e)}
        onKeyDown={this.props.onKeyDown}
      >
        {this.props.children}
      </div>
    );
  }
}

namespace DoubleClick {
  export interface Props extends JSX.ElementChildrenAttribute {
    children: JSX.Element;
    className?: string;
    onDoubleClick?: (e: React.MouseEvent) => void;
    onKeyDown?: (e: React.KeyboardEvent) => void;
  }
}

export { DoubleClick };