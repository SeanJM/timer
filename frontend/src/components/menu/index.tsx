import React, { Component } from "react";

interface Props extends JSX.ElementChildrenAttribute {
  className?: string;
}

export * from "@frontend/components/menu/menu-item";

export class Menu extends Component<Props, {}> {
  render() {
    return (
      <div className="menu">
        {this.props.children}
      </div>
    );
  }
}