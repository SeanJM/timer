import React, { Component } from "react";
import { DragMe, DragMeEvent } from "@frontend/components/drag-me";
import { InputValueEvent } from "@types";
import { SlideSegments } from "@frontend/components/slide/slide-segments";
import { SlideShadow } from "./slide-shadow";
import { KEYNAME_BY_CODE } from "@constants";

export interface SlideProps {
  length?: number;
  name?: string;
  defaultValue?: number;
  autofocus?: boolean;

  onBlur?: (e: React.FocusEvent) => void;
  onFocus?: (e: React.FocusEvent) => void;
  onInput?: (e: InputValueEvent) => void;
  onValue?: (e: InputValueEvent) => void;
}

export interface SlideState {
  isDragging: boolean;
  isFocus: boolean;
  shadowPositionX: number;
  value: number;
}

export class Slide extends Component<SlideProps, SlideState> {
  node: HTMLDivElement;

  constructor(props) {
    super(props);
    this.state = {
      isDragging: false,
      isFocus: false,

      shadowPositionX: 0,
      value: this.props.defaultValue || 0,
    };
  }

  getValueEvent(props: Partial<InputValueEvent> = {}) {
    return Object.assign({
      name: this.props.name,
      type: "number",
      value: this.state.value,
    }, props);
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
      value,
    });
  }

  onDragEnd(e: DragMeEvent) {
    const value = this.getValue(e.positionX);
    const evt = this.getValueEvent({ value });

    this.props.onValue(evt);
    this.props.onInput(evt);

    this.setState({
      isDragging: false
    });
  }

  onFocus(e) {
    this.setState({
      isFocus: true
    });

    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  }

  onBlur(e) {
    this.setState({
      isFocus: false
    });

    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  }

  onKeyDown(e) {
    if (KEYNAME_BY_CODE[e.which] === "LEFT") {
      let evt = this.getValueEvent({
        value: Math.max(0, this.state.value - 1),
      });
      this.props.onValue(evt);
      this.props.onInput(evt);
    } else if (KEYNAME_BY_CODE[e.which] === "RIGHT") {
      let evt = this.getValueEvent({
        value: Math.min(this.props.length, this.state.value + 1),
      });
      this.props.onValue(evt);
      this.props.onInput(evt);
    }
  }

  componentDidUpdate(prevProps: SlideProps) {
    if (prevProps.defaultValue !== this.props.defaultValue) {
      let evt = this.getValueEvent({ value: this.props.defaultValue || 0 });
      this.setState({ value: evt.value });
      this.props.onValue(evt);
    }
  }

  componentDidMount() {
    this.props.onValue(
      this.getValueEvent()
    );

    if (this.props.autofocus) {
      this.node.focus();
    }
  }

  render() {
    const value = this.state.value;
    const length = this.props.length || 10;
    const className = ["slide"];

    if (this.state.isFocus) {
      className.push("slide--focus");
    }

    return (
      <DragMe
        $ref={(node) => { this.node = node; }}
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