import React from "react";

export interface DragMeEvent {
  offsetX: number;
  offsetY: number;
  pageX: number;
  pageY: number;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  target: HTMLDivElement;
}

interface DragMeProps extends Partial<JSX.ElementChildrenAttribute> {
  className?: string;
  autofocus?: boolean;
  onMouseDown?: (e: DragMeEvent) => void;
  onDragMove?: (e: DragMeEvent) => void;
  onDragEnd?: (e: DragMeEvent) => void;
  onDragStart?: (e: DragMeEvent) => void;
  onFocus?: (e: React.FocusEvent) => void;
  onBlur?: (e: React.FocusEvent) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

interface DragMeState {
  isMouseDown: boolean;
  isDragStart: boolean;
  pageX: number;
  pageY: number;
}

export class DragMe extends React.Component<DragMeProps, DragMeState> {
  node: HTMLDivElement;

  constructor(props) {
    super(props);
    this.state = {
      isMouseDown: false,
      isDragStart: false,
      pageX: 0,
      pageY: 0,
    };
  }

  componentDidMount() {
    if (this.props.autofocus) {
      this.node.focus();
    }

    document.body.addEventListener("mousemove", this);
    document.body.addEventListener("mouseup", this);
  }

  componentWillUnmount() {
    document.body.removeEventListener("mousemove", this);
    document.body.removeEventListener("mouseup", this);
  }

  dispatchRef = (node) => {
    this.node = node;
  }

  onMouseMove(e) {
    if (this.state.isMouseDown && !this.state.isDragStart) {
      this.setState({
        isDragStart: true
      });
      if (this.props.onDragStart) {
        this.props.onDragStart(this.getDragMeEvent(e));
      }
    } else if (this.state.isMouseDown) {
      if (this.props.onDragMove) {
        this.props.onDragMove(this.getDragMeEvent(e));
      }
    }
  }

  dispatchMouseDown = (e: React.MouseEvent) => {
    this.setState({
      isMouseDown: true,
      pageX: e.pageX,
      pageY: e.pageY,
    });
    if (this.props.onMouseDown) {
      this.props.onMouseDown(this.getDragMeEvent(e));
    }
    document.body.style.userSelect = "none";
  }

  dispatchMouseUp = (e) => {
    if (this.state.isMouseDown) {
      this.setState({
        isMouseDown: false,
        isDragStart: false,
      });
      if (this.props.onDragEnd) {
        this.props.onDragEnd(this.getDragMeEvent(e));
      }
    }
    document.body.style.userSelect = null;
  }

  dispatchKeyDown(e) {
    if (this.props.onKeyDown) {
      this.props.onKeyDown(e);
    }
  }

  dispatchFocus = (e) => {
    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  }

  dispatchBlur = (e) => {
    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  }

  handleEvent(e) {
    switch (e.type) {
      case "mousemove": {
        this.onMouseMove(e);
        break;
      }

      case "mouseup": {
        this.dispatchMouseUp(e);
      }
    }
  }

  getDragMeEvent(e: MouseEvent | React.MouseEvent): DragMeEvent {
    const offset = this.node.getBoundingClientRect();
    const offsetX = e.pageX - offset.left;
    const offsetY = e.pageY - offset.top;
    return {
      offsetX,
      offsetY,
      pageX: e.pageX,
      pageY: e.pageY,
      positionX: offsetX / offset.width,
      positionY: offsetY / offset.height,
      width: offset.width,
      height: offset.height,
      target: this.node,
    };
  }

  render() {
    return (
      <div
        className={this.props.className}
        onBlur={this.dispatchBlur}
        onFocus={this.dispatchFocus}
        onKeyDown={this.dispatchKeyDown}
        onMouseDown={this.dispatchMouseDown}
        ref={this.dispatchRef}
        tabIndex={0}
      >
        {this.props.children}
      </div>
    );
  }
}