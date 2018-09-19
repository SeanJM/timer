import React, { Component } from "react";
import { withStore, StoreState } from "@frontend/store";
import { CONTEXT_MENU_LIST } from "./context-menu-list";

interface ContextMenuContainerProps
  extends Pick<StoreState, "contextMenu"> { }

interface ContextMenuContainerState {
  pageX: number;
  pageY: number;
}

function mapStateToProps(state: StoreState, props): ContextMenuContainerProps {
  return {
    contextMenu: state.contextMenu
  };
}

export class ContextMenuContainerView
  extends Component<ContextMenuContainerProps, ContextMenuContainerState> {

  constructor(props) {
    super(props);
    this.state = {
      pageX: 0,
      pageY: 0,
    };
  }

  handleEvent(e: MouseEvent) {
    this.setState({
      pageX: e.pageX,
      pageY: e.pageY,
    });
  }

  componentDidMount() {
    document.body.addEventListener("mousedown", this);
  }

  render() {
    return (
      <div className="context-menu-container">
        {this.props.contextMenu.map((a) => {
          const Element = CONTEXT_MENU_LIST[a];
          return (
            <Element key={a} id={a} pageX={this.state.pageX} pageY={this.state.pageY} />
          );
        })}
      </div>
    );
  }
}

export const ContextMenuContainerConnect =
  withStore(ContextMenuContainerView, mapStateToProps)();