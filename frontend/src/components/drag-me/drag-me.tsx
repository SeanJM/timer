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
}

interface DragMeProps extends Partial<JSX.ElementChildrenAttribute> {
  className?: string;
  $ref?: (e: HTMLDivElement) => void;
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
    document.body.addEventListener("mousemove", this);
    document.body.addEventListener("mouseup", this);
  }

  componentWillUnmount() {
    document.body.removeEventListener("mousemove", this);
    document.body.removeEventListener("mouseup", this);
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

  onMouseDown(e: React.MouseEvent) {
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

  onMouseUp(e) {
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

  onKeyDown(e) {
    if (this.props.onKeyDown) {
      this.props.onKeyDown(e);
    }
  }

  onFocus(e) {
    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  }

  onBlur(e) {
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
        this.onMouseUp(e);
      }
    }
  }

  getDragMeEvent(e: MouseEvent | React.MouseEvent): DragMeEvent {
    const offset = this.node.getBoundingClientRect();
    const offsetX = e.pageX - offset.left;
    const offsetY = e.pageY - offset.top;
    const nextPageX = Math.max(0, Math.min(offsetX, offset.width));
    const nextPageY = Math.max(0, Math.min(offsetY, offset.height));
    return {
      offsetX,
      offsetY,
      pageX: nextPageX,
      pageY: nextPageY,
      positionX: nextPageX / offset.width,
      positionY: nextPageY / offset.height,
      width: offset.width,
      height: offset.height,
    };
  }

  render() {
    return (
      <div
        ref={(node) => {
          this.node = node;
          if (this.props.$ref) {
            this.props.$ref(node);
          }
        }}
        className={this.props.className}
        onBlur={(e) => this.onBlur(e)}
        onFocus={(e) => this.onFocus(e)}
        onKeyDown={(e) => this.onKeyDown(e)}
        onMouseDown={(e) => this.onMouseDown(e)}
        tabIndex={0}
      >
        {this.props.children}
      </div>
    );
  }
}