import React, { Component } from "react";
import { dispatch } from "@frontend/action";

export interface ContextMenuProps {
  children: JSX.Element[];
  id?: string;
  pageX?: number;
  pageY?: number;
}

interface ContextMenuState {
  pageX?: number;
  pageY?: number;
}

export class ContextMenuView extends Component<ContextMenuProps, ContextMenuState> {
  contextMenuNode: HTMLDivElement;

  constructor(props) {
    super(props);
    this.state = {
      pageY: props.pageY,
      pageX: props.pageX,
    };
  }

  close() {
    dispatch("CONTEXT_MENU", {
      type: "CLOSE",
      value: {
        id: this.props.id,
      }
    });
  }

  handleEvent(e) {
    if (!this.contextMenuNode.contains(e.target)) {
      this.close();
    }
  }

  componentDidMount() {
    const contextMenuOffset = this.contextMenuNode.getBoundingClientRect();
    this.setState({
      pageY: contextMenuOffset.top - 5,
      pageX: this.props.pageX - contextMenuOffset.width + 10,
    });
    document.body.addEventListener("mousedown", this);
  }

  componentWillUnmount() {
    document.body.removeEventListener("mousedown", this);
  }

  render() {
    const children =
      React.Children
        .toArray(this.props.children)
        .map((child: JSX.Element) => {
          const onClick = child.props.onClick;
          return React.cloneElement(child, {
            onClick: (e: React.MouseEvent) => {
              if (onClick) {
                onClick(e);
              }
              this.close();
            }
          });
        });

    return (
      <div
        ref={(node) => {
          this.contextMenuNode = node;
        }}
        style={{
          left: this.state.pageX,
          top: this.state.pageY,
        }}
        className="context-menu">
        <ul>
          {children}
        </ul>
      </div>
    );
  }
}
