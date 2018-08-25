import React from "react";

interface DragMeEvent {
  pageX: number;
  pageY: number;
  positionX: number;
  positionY: number;
}

interface DragMeProps extends Partial<JSX.ElementChildrenAttribute> {
  className?: string;
  onMouseDown?: (e: DragMeEvent) => void;
  onDragMove?: (e: DragMeEvent) => void;
  onDragEnd?: (e: DragMeEvent) => void;
  onDragStart?: (e: DragMeEvent) => void;
}

interface DragMeState {
  isMouseDown: boolean;
  isDragStart: boolean;
  pageX: number;
  pageY: number;
}

export default class DragMe extends React.Component<DragMeProps, DragMeState> {
  onmove: (e: MouseEvent) => void;
  node: HTMLDivElement;

  constructor(props) {
    super(props);

    this.state = {
      isMouseDown: false,
      isDragStart: false,
      pageX: 0,
      pageY: 0,
    };

    this.onmove = (e) => {
      if (this.state.isMouseDown && !this.state.isDragStart) {
        this.setState({
          isDragStart: true
        });
        props.onDragStart &&
        props.onDragStart(this.getDragMeEvent(e));
      } else if (this.state.isMouseDown) {
        props.onDragMove &&
        props.onDragMove(this.getDragMeEvent(e));
      }
    }

    document.body.addEventListener("mousemove", this.onmove);
    document.body.addEventListener("mouseup", (e) => {
      if (this.state.isMouseDown) {
        this.setState({
          isMouseDown: false,
          isDragStart: false,
        });
        this.props.onDragEnd &&
        this.props.onDragEnd(this.getDragMeEvent(e));
      }
    });
  }

  getDragMeEvent(e: MouseEvent | React.MouseEvent): DragMeEvent {
    const offset = this.node.getBoundingClientRect();
    const nextPageX = Math.max(0, Math.min(e.pageX - offset.left, offset.width));
    const nextPageY = Math.max(0, Math.min(e.pageY - offset.top, offset.height));
    return {
      pageX: nextPageX,
      pageY: nextPageY,
      positionX: nextPageX / offset.width,
      positionY: nextPageY / offset.height,
    };
  }

  onMouseDown(e: React.MouseEvent) {
    this.setState({
      isMouseDown: true,
      pageX: e.pageX,
      pageY: e.pageY,
    });
    this.props.onMouseDown && this.props.onMouseDown(this.getDragMeEvent(e));
  }

  render() {
    return (
      <div
        className={this.props.className}
        ref={node => { this.node = node; }}
        onMouseDown={(e) => this.onMouseDown(e)}>
        {this.props.children}
      </div>
    );
  }
}