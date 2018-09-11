import React, { Component } from "react";
import { DragMe, DragMeEvent } from "@frontend/components/drag-me";
import { SlideShadow } from "./slide-shadow";
import { SlideSegments } from "@frontend/components/slide/slide-segments";

export interface SlideProps {
  length?: number;
  value?: number;
  onValue?: (value: number) => void;
  onInput?: (value: number) => void;
  onFocus?: (e: React.FocusEvent) => void;
  onBlur?: (e: React.FocusEvent) => void;
}

export interface SlideState {
  isDragging: boolean;
  shadowPositionX: number;
}

export class Slide extends Component<SlideProps, SlideState> {
  constructor(props) {
    super(props);
    this.state = {
      isDragging: false,
      shadowPositionX: 0
    };
  }

  getValue(positionX: number) {
    let value = positionX * this.props.length;
    if (value % 1 > 0.8) {
      value = Math.ceil(value);
    } else {
      value = Math.floor(value);
    }
    return value;
  }

  onDragStart(e: DragMeEvent) {
    this.setState({
      isDragging: true
    });
  }

  onDragMove(e: DragMeEvent) {
    let value = this.getValue(e.positionX);
    this.setState({
      shadowPositionX: e.positionX,
    });
    this.props.onValue(value);
  }

  onDragEnd(e: DragMeEvent) {
    const value = this.getValue(e.positionX);
    this.props.onInput(value);
    this.setState({
      isDragging: false
    });
  }

  render() {
    const value = this.props.value;
    const length = this.props.length || 10;

    return (
      <DragMe
        className="slide"
        onDragStart={(e) => this.onDragStart(e)}
        onDragMove={(e) => this.onDragMove(e)}
        onDragEnd={(e) => this.onDragEnd(e)}
      >
        <SlideSegments
          length={length}
          value={value}/>
        {this.state.isDragging
          ? <SlideShadow
              length={length}
              positionX={this.state.shadowPositionX}/>
          : null}
        <div className="slide_thumb-container">
          <div
            className={"slide_thumb" + (this.state.isDragging ? " slide_thumb--active" : "")}
            style={{
              left: ((this.props.value / this.props.length) * 100) + "%"
            }}
          />
        </div>
      </DragMe>
    );
  }
}