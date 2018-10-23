import React from "react";
import { Titlebar } from "@components/titlebar";
import { DragMe, DragMeEvent } from "@components/drag-me";
import { Button } from "@components/button";
import { dispatch } from "@action";

class Dialog extends React.Component<Dialog.Props, Dialog.State> {
  node: HTMLDivElement;

  constructor(props) {
    super(props);
    this.state = {
      left: null,
      top: null,
      offsetLeft: null,
      offsetTop: null,
    };
  }

  componentDidMount() {
    const nodeClientRect = this.node.getBoundingClientRect();

    this.setState({
      left: (window.innerWidth / 2) - (nodeClientRect.width / 2),
      top: Math.min(window.innerHeight / 4, Math.max(100, (window.innerHeight / 2) - (nodeClientRect.height / 2.3))),
    });
  }

  dispatchRef = (node) => {
    this.node = this.node || node;
  }

  dispatchDragStart = (e: DragMeEvent) => {
    const targetClientRect =
      e.target.getBoundingClientRect();

    this.setState({
      offsetLeft: e.pageX - targetClientRect.left,
      offsetTop: e.pageY - targetClientRect.top,
    });
  }

  dispatchDragMove = (e: DragMeEvent) => {
    this.setState({
      left: e.pageX - this.state.offsetLeft,
      top:  e.pageY - this.state.offsetTop,
    });
  }

  dispatchClose = () => {
    dispatch("DIALOG", {
      type: "CLOSE",
      value: {
        id: this.props.id,
      }
    });
  }

  render() {
    return (
      <div
        className="dialog"
        ref={this.dispatchRef}
        style={{
          left: this.state.left,
          top: this.state.top,
        }}
      >
        <DragMe
          className="dialog_head"
          onDragMove={this.dispatchDragMove}
          onDragStart={this.dispatchDragStart}
        >
          <Titlebar secondaryAction={<Button icon="close" onClick={this.dispatchClose}/>}>
            <h6>{this.props.title}</h6>
          </Titlebar>
        </DragMe>
        <div className="dialog_body">{this.props.body}</div>
        <div className="dialog_footer">{this.props.footer}</div>
      </div>
    );
  }
}

namespace Dialog {
  export interface Props {
    title: string;
    body: JSX.Element;
    footer: JSX.Element;
    id?: string | number;
  }

  export interface State {
    left: number | null;
    top: number | null;
    offsetLeft: number | null;
    offsetTop: number | null;
  }
}

export { Dialog };