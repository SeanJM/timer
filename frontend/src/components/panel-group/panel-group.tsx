import _ from "lodash";
import React, { Component } from "react";
import { DragMeEvent } from "@frontend/components/drag-me";
import { PanelProps } from "./panel";

interface PanelGroupProps {
  children: React.ReactElement<PanelProps>[];
}

interface PanelGroupState {
  innerWidth: number;
  childrenMappedWidths: number[];
}

export class PanelGroup extends Component<PanelGroupProps, PanelGroupState> {
  node: HTMLDivElement;

  constructor(props) {
    super(props);
    this.state = {
      innerWidth: 0,
      childrenMappedWidths: [],
    };
  }

  getChildrenWidths() {
    const children = React.Children.toArray(this.props.children) as React.ReactElement<PanelProps>[];
    const childrenByWidth = [];

    let childrenWidthNoWidth = 0;
    let totalChildrenWidth = 0;
    let i = -1;
    const n = children.length;

    while (++i < n) {
      childrenByWidth[i] = children[i].props.defaultWidth || 0;
      totalChildrenWidth += childrenByWidth[i];
      childrenWidthNoWidth += !childrenByWidth[i] ? 1 : 0;
    }

    return {
      totalChildrenWidth: totalChildrenWidth,
      childrenWithNoWidth: childrenWidthNoWidth,
    };
  }

  setChildrenMappedWidths() {
    const { totalChildrenWidth, childrenWithNoWidth } = this.getChildrenWidths();

    const children =
      React.Children.toArray(this.props.children) as React.ReactElement<PanelProps>[];

    const nodeWidth = this.node.getBoundingClientRect().width;

    let i = -1;
    const n = children.length;
    const childrenMappedWidths = [];
    const defaultWidth = (nodeWidth - totalChildrenWidth) / childrenWithNoWidth;

    while (++i < n) {
      childrenMappedWidths[i] = children[i].props.defaultWidth || defaultWidth;
    }

    this.setState({ childrenMappedWidths });
  }

  handleEvent() {
    this.setChildrenMappedWidths();
  }

  componentDidMount() {
    setTimeout(() => {
      this.setChildrenMappedWidths();
      window.addEventListener("resize", this);
    }, 10);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this);
  }

  componentDidUpdate(prevProps) {
    const prevChildren = React.Children.toArray(prevProps.children).filter((a) => a);
    const nextChildren = React.Children.toArray(this.props.children).filter((a) => a);
    if (nextChildren.length !== prevChildren.length) {
      setTimeout(() => {
        this.setChildrenMappedWidths();
      }, 10);
    }
  }

  onPanelDragMove(e: DragMeEvent, i) {
    const childrenMappedWidths = this.state.childrenMappedWidths.slice();
    childrenMappedWidths[i] = childrenMappedWidths[i] - e.offsetX;
    childrenMappedWidths[i - 1] = childrenMappedWidths[i - 1] + e.offsetX;
    this.setState({ childrenMappedWidths });
  }

  render() {
    const children =
      React.Children.toArray(this.props.children) as React.ReactElement<PanelProps>[];

    return (
      <div
        ref={(node) => {
          this.node = node;
        }}
        className="panel-group"
      >
        {children.map((child, i) => {
          return React.cloneElement<PanelProps>(child, {
            onDragMove: (e) => this.onPanelDragMove(e, i),
            defaultWidth: this.state.childrenMappedWidths[i],
            index: i,
          });
        })}
      </div>
    );
  }
}