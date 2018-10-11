import React, { Children, Component } from "react";
import { TabProps, TabWidthEvent } from "./tab";

interface TabBarProps {
  children: JSX.Element[];
  className?: string;
}

interface TabBarState {
  maxWidth: number;
  width: number;
}

export class TabBar extends Component<TabBarProps, TabBarState> {
  timer: any;

  constructor(props) {
    super(props);
    this.state = {
      maxWidth: 0,
      width: null,
    };
  }

  setWidths() {
    this.setState({
      width: this.state.maxWidth,
    });
  }

  onWidthReceived({ width }: TabWidthEvent) {
    this.setState({
      maxWidth: width > this.state.maxWidth ? width : this.state.maxWidth,
    });

    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.setWidths(), 0);
  }

  render() {
    const {
      className
    } = this.props;

    const classList =
      [ "tab-bar" ];

    const children =
      Children.toArray(this.props.children) as React.ReactElement<TabProps>[];

    if (className) {
      classList.push(className);
    }

    return (
      <div
        style={{ opacity: this.state.width ? 1 : 0 }}
        className={classList.join(" ")}
      >
        {children.map((child, index) => {
          return React.cloneElement(child, {
            onWidthReceived: (e) => this.onWidthReceived(e),
            width: this.state.width,
            index: index + 1,
            length: children.length,
          });
        })}
      </div>
    );
  }
}