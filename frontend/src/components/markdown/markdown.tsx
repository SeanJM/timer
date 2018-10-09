import React, { Component } from "react";
import marked from "marked";

interface MarkdownProps {
  children: string;
}

export class Markdown extends Component<MarkdownProps, {}> {
  node: HTMLDivElement;

  update() {
    const value = this.props.children || "";
    this.node.innerHTML = marked(value);
  }

  componentDidMount() {
    this.update();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.children !== this.props.children) {
      this.update();
    }
  }

  render() {
    return (
      <div ref={(node) => { this.node = node; }}></div>
    );
  }
}