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
  isFocus: boolean;
  isDragging: boolean;
  shadowPositionX: number;
}

export class Slide extends Component<SlideProps, SlideState> {
  constructor(props) {
    super(props);
    this.state = {
      isFocus: false,
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

  onFocus(e) {
    this.setState({
      isFocus: true
    });
  }

  onBlur(e) {
    this.setState({
      isFocus: false
    });
  }

  onKeyDown(e) {
    if (e.which === 37) {
      let value = Math.max(0, this.props.value - 1);
      this.props.onInput(value);
    } else if (e.which === 39) {
      let value = Math.min(this.props.length, this.props.value + 1);
      this.props.onInput(value);
    }
  }

  render() {
    const value = this.props.value;
    const length = this.props.length || 10;
    const className = ["slide"];

    if (this.state.isFocus) {
      className.push("slide--focus");
    }

    return (
      <DragMe
        className={className.join(" ")}
        onFocus={(e) => this.onFocus(e)}
        onBlur={(e) => this.onBlur(e)}
        onDragStart={(e) => this.onDragStart(e)}
        onDragMove={(e) => this.onDragMove(e)}
        onDragEnd={(e) => this.onDragEnd(e)}
        onKeyDown={(e) => this.onKeyDown(e)}
      >
        <SlideSegments
          length={length}
          value={value}/>
        <div className="slide-focus"/>
        {this.state.isDragging
          ? <SlideShadow
              length={length}
              positionX={this.state.shadowPositionX}/>
          : null}
        <div className="slide_thumb-container">
          <div
            className={"slide_thumb" + (this.state.isDragging ? " slide_thumb--active" : "")}
            style={{
              left: ((value / length) * 100) + "%"
            }}
          />
        </div>
      </DragMe>
    );
  }
}