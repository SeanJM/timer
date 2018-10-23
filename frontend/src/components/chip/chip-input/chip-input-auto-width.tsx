import _ from "lodash";
import React, { Component } from "react";
import { KEYNAME_BY_CODE } from "@constants";
import { ChipSubmitEvent } from "../chip-types";

export interface ChipInputAutoWidthProps {
  $ref: (node: HTMLInputElement) => void;
  defaultValue?: string;
  onBlur: (e: React.FocusEvent) => void;
  onFocus: (e: React.FocusEvent) => void;
  onInput: (e: React.FormEvent) => void;
  onBackspace: (e: React.KeyboardEvent) => void;
  onSubmit: (e: ChipSubmitEvent) => void;
}

export interface ChipInputAutoWidthState {
  width: number | "auto";
}

export class ChipInputAutoWidth extends Component<ChipInputAutoWidthProps, ChipInputAutoWidthState> {
  mirror: HTMLDivElement;
  input: HTMLInputElement;

  constructor(props) {
    super(props);
    this.state = {
      width: "auto"
    };
  }

  componentDidMount() {
    const inputStyles = window.getComputedStyle(this.input);

    this.mirror = document.createElement("div");
    this.mirror.style.fontSize = inputStyles.fontSize;
    this.mirror.style.left = "10px";
    this.mirror.style.lineBreak = inputStyles.lineBreak;
    this.mirror.style.lineHeight = inputStyles.lineHeight;
    this.mirror.style.padding = inputStyles.padding;
    this.mirror.style.position = "absolute";
    this.mirror.style.top = "10px";
    this.mirror.style.whiteSpace = "nowrap";
    this.mirror.innerHTML = this.props.defaultValue;

    document.body.appendChild(this.mirror);
    this.resize();
  }

  clearValue = () => {
    this.input.value = "";
    setTimeout(this.focus, 100);
  }

  focus = () => {
    this.input.focus();
  }

  onref = (node: HTMLInputElement) => {
    this.input = this.input || node;
    this.props.$ref(this.input);
  }

  resize() {
    this.setState({
      width: Math.max(10, this.mirror.getBoundingClientRect().width)
    });
  }

  onInput = (e: React.FormEvent) => {
    const { onInput } = this.props;

    if (onInput) {
      onInput(e);
    }

    this.mirror.innerHTML = this.input.value;
    this.resize();
  }

  onKeyDown = (e: React.KeyboardEvent) => {
    const { onBackspace } = this.props;
    switch (KEYNAME_BY_CODE[e.which]) {
      case "BACKSPACE": {
        if (onBackspace) {
          onBackspace(e);
        }
      }
    }
  }

  onKeyUp = (e: React.KeyboardEvent) => {
    const { onSubmit } = this.props;
    switch (KEYNAME_BY_CODE[e.which]) {
      case "ENTER": {
        if (onSubmit) {
          onSubmit({
            clearValue: this.clearValue,
            type: "submit",
            value: this.input.value,
          });
        }
      }
    }
  }

  render() {
    const { onFocus, onBlur } = this.props;
    return (
      <input
        className="chip-input_target"
        defaultValue={this.props.defaultValue}
        onBlur={onBlur}
        onFocus={onFocus}
        onInput={this.onInput}
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
        ref={this.onref}
        style={{ width: this.state.width }}
        type="text"
      />
    );
  }
}