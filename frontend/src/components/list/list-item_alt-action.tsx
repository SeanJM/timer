import React, { Component } from "react";
import anime from "animejs";

interface AltActionProps extends Partial<JSX.ElementChildrenAttribute> {
  onBoundingBox: (e: ClientRect) => void;
}

export class ListItemAltAction extends Component<AltActionProps> {
  contentNode: HTMLDivElement;
  node: HTMLDivElement;

  componentDidMount() {
    const { onBoundingBox } = this.props;
    const boundingBox = this.contentNode.getBoundingClientRect();

    if (onBoundingBox) {
      setTimeout(() => {
        onBoundingBox(boundingBox);
      }, 10);
    }

    anime({
      targets: this.node,
      opacity: [ 0, 1 ],
      translateX: [ -boundingBox.width, 0 ],
      easing: "easeOutQuad",
      duration: 300,
    });
  }

  render() {
    return (
      <div
        className="list-item_alt-action"
        ref={(node) => { this.node = node; }}
      >
        <div
          className="list-item_alt-action-content"
          ref={(node) => { this.contentNode = node; }}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}