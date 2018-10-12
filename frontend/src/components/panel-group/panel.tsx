import React, { Component } from "react";
import { DragMe, DragMeEvent } from "@frontend/components/drag-me";

export interface PanelProps {
  defaultWidth?: number;
  onDragMove?: (e: DragMeEvent) => void;
  onDragEnd?: (e: DragMeEvent) => void;
  onWidthChanged?: (e: { width: number }) => void;
  index?: number;
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