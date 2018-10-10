import React, { Component } from "react";
import { DragMe, DragMeEvent } from "@frontend/components/drag-me";
import { InputValueEvent } from "@types";
import { SlideSegments } from "@frontend/components/slide/slide-segments";
import { SlideShadow } from "./slide-shadow";
import { KEYNAME_BY_CODE } from "@constants";

export interface SlideProps {
  length?: number;
  name?: string;
  value?: number;

  onBlur?: (e: React.FocusEvent) => void;
  onFocus?: (e: React.FocusEvent) => void;
  onInput?: (e: InputValueEvent) => void;
  onValue?: (e: InputValueEvent) => void;
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

    this.props.onValue({
      name: this.props.name,
      type: "number",
      value,
    });
  }

  onDragEnd(e: DragMeEvent) {
    const value = this.getValue(e.positionX);

    this.props.onInput({
      name: this.props.name,
      type: "number",
      value,
    });

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
    const evt = {
      name: this.props.name,
      type: "number",
      value: this.props.value,
    };

    if (KEYNAME_BY_CODE[e.which] === "LEFT") {
      evt.value = Math.max(0, evt.value - 1);
      this.props.onInput(evt);
    } else if (KEYNAME_BY_CODE[e.which] === "RIGHT") {
      evt.value = Math.min(this.props.length, evt.value + 1);
      this.props.onInput(evt);
    }
  }

  componentDidMount() {
    this.props.onValue({
      name: this.props.name,
      type: "number",
      value: this.props.value,
    });
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

        onBlur={(e) => this.onBlur(e)}
        onDragEnd={(e) => this.onDragEnd(e)}
        onDragMove={(e) => this.onDragMove(e)}
        onDragStart={(e) => this.onDragStart(e)}
        onFocus={(e) => this.onFocus(e)}
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