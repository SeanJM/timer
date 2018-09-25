import React, { Component } from "react";
import { DragMe, DragMeEvent } from "@frontend/components/drag-me";

interface PanelProps {
  defaultWidth?: number;
  onDragMove?: (e: DragMeEvent) => void;
  onDragEnd?: (e: DragMeEvent) => void;
  onWidthChanged?: (e: { width: number }) => void;
  index?: number;
}

interface PanelGroupProps {
  children: React.ReactElement<PanelProps>[];
}

interface PanelGroupState {
  innerWidth: number;
  totalChildrenWidth: number;
  childrenWithNoWidth: number;
  childrenMappedWidths: number[];
}

export class Panel extends Component<PanelProps, {}> {
  render() {
    return (
      <div
        style={{
          width: this.props.defaultWidth,
        }}
        className="panel"
      >
        {this.props.index > 0
          ? (
            <DragMe
              onDragEnd={() => this.props.onWidthChanged({ width: this.props.defaultWidth })}
              onDragMove={this.props.onDragMove}
              className="panel-drag">
                <div className="panel-drag_thumb"/>
            </DragMe>
          )
          : null
        }
        {this.props.children}
      </div>
    );
  }
}

export class PanelGroup extends Component<PanelGroupProps, PanelGroupState> {
  node: HTMLDivElement;

  constructor(props) {
    const children = React.Children.toArray(props.children) as React.ReactElement<PanelProps>[];
    const childrenByWidth = [];

    let childrenWidthNoWidth = 0;
    let totalChildrenWidth = 0;
    let i = -1;
    const n = children.length;
    super(props);

    while (++i < n) {
      childrenByWidth[i] = children[i].props.defaultWidth || 0;
      totalChildrenWidth += childrenByWidth[i];
      childrenWidthNoWidth += !childrenByWidth[i] ? 1 : 0;
    }

    this.state = {
      innerWidth: 0,
      totalChildrenWidth: totalChildrenWidth,
      childrenWithNoWidth: childrenWidthNoWidth,
      childrenMappedWidths: [],
    };
  }

  setChildrenMappedWidths() {
    const children =
      React.Children.toArray(this.props.children) as React.ReactElement<PanelProps>[];

    let i = -1;
    const n = children.length;
    const childrenMappedWidths = [];
    const defaultWidth = this.state.innerWidth - (this.state.totalChildrenWidth / this.state.childrenWithNoWidth);

    while (++i < n) {
      childrenMappedWidths[i] = children[i].props.defaultWidth || defaultWidth;
    }

    this.setState({ childrenMappedWidths });
  }

  handleEvent() {
    this.setState({
      innerWidth: this.node.getBoundingClientRect().width
    });
  }

  componentDidMount() {
    this.setState({
      innerWidth: this.node.getBoundingClientRect().width
    }, () => this.setChildrenMappedWidths());
    window.addEventListener("resize", this);
  }

  componentWillMount() {
    window.removeEventListener("resize", this);
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