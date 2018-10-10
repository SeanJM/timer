import * as React from "react";
import { Component } from "react";
import { inputWrapper } from "@frontend/components/input/input-wrapper";
import { InputValueEvent } from "@types";

interface InputTextProps {
  onBlur: (e: React.FocusEvent) => void;
  onFocus: (e: React.FocusEvent) => void;
  onValue: (e: InputValueEvent) => void;

  onInput?: (e: React.FormEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;

  autofocus?: boolean;
  defaultValue?: string;
  name?: string;
}

interface InputTextState {
  focus: boolean;
}

class InputTextView extends Component<InputTextProps, InputTextState> {
  node: HTMLInputElement;

  constructor(props) {
    super(props);
    this.state = {
      focus: false
    };
  }

  onInput(e) {
    const {
      onInput,
    } = this.props;

    if (onInput) {
      onInput(e);
    }

    this.onValue();
  }

  onValue() {
    const {
      name,
      onValue,
    } = this.props;

    if (onValue) {
      onValue({
        name,
        type: "string",
        value: this.node.value,
      });
    }
  }

  onFocus(e: React.FocusEvent) {
    const { onFocus } = this.props;
    if (onFocus) {
      onFocus(e);
    }
  }

  onBlur(e: React.FocusEvent) {
    const { onBlur } = this.props;
    if (onBlur) {
      onBlur(e);
    }
  }

  componentDidMount() {
    if (this.props.autofocus) {
      this.node.focus();
    }
    this.onValue();
  }

  componentDidUpdate(prevProps: InputTextProps) {
    if (prevProps.defaultValue !== this.props.defaultValue) {
      this.node.value = this.props.defaultValue ? this.props.defaultValue : "";
      this.onValue();
    }
  }

  render() {
    const {
      onKeyDown,
    } = this.props;

    return (
      <input
        defaultValue={this.props.defaultValue}
        ref={(node) => { this.node = node; }}
        type="text"

        onBlur={(e) => this.onBlur(e)}
        onFocus={(e) => this.onFocus(e)}
        onInput={(e) => this.onInput(e)}
        onKeyDown={(e) => onKeyDown && onKeyDown(e)}
      />
    );
  }
}

export const InputText = inputWrapper<InputTextProps>(InputTextView);