import React, { Component } from "react";

export interface TabWidthEvent {
  width: number;
}

export interface TabProps extends JSX.ElementChildrenAttribute {
  index?: number;
  isActive?: boolean;
  length?: number;
  width?: number;

  onClick?: (e: React.MouseEvent) => void;
  onWidthReceived?: (e: TabWidthEvent) => void;
}

export class Tab extends Component<TabProps> {
  node: HTMLDivElement;

  componentDidMount() {
    setTimeout(() => {
      this.props.onWidthReceived({
        width: this.node.getBoundingClientRect().width,
      });
    }, 0);
  }

  render() {
    const {
      index,
      isActive,
      length,
      onClick,
      width,
    } = this.props;

    const classList = [ "tab" ];

    classList.push("tab-" + index + "-" + length);

    if (isActive) {
      classList.push("tab--active");
    }

    return (
      <div
        ref={(node) => { this.node = node; }}
        onClick={onClick}
        className={classList.join(" ")}
        style={{
          width
        }}
      >
        <div className="tab_text">
          {this.props.children}
        </div>
      </div>
    );
  }
}