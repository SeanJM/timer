import React, { Component } from "react";

interface ListProps extends Partial<JSX.ElementChildrenAttribute> {
  id?: string;
}

export class List extends Component<ListProps> {
  render() {
    return (
      <div id={this.props.id} className="list">{this.props.children}</div>
    );
  }
}