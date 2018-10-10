import React, { Component } from "react";

import { InputValueEvent } from "@types";
import { inputWrapper } from "@components/input/input-wrapper";

interface InputTextareaProps {
  onBlur: (e: React.FocusEvent) => void;
  onFocus: (e: React.FocusEvent) => void;
  onInput?: (e: React.FormEvent) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onValue: (e: InputValueEvent) => void;

  autofocus?: boolean;
  defaultValue?: string;
  name?: string;
}

class InputTextareaView extends Component<InputTextareaProps> {
  node: HTMLTextAreaElement;

  onValue() {
    const { onValue, name } = this.props;
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

  onInput(e: React.FormEvent) {
    const { onInput } = this.props;
    if (onInput) {
      onInput(e);
    }
  }

  onKeyDown(e: React.KeyboardEvent) {
    const { onKeyDown } = this.props;
    if (onKeyDown) {
      onKeyDown(e);
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

  componentDidUpdate(prevProps) {
    if (prevProps.defaultValue !== this.props.defaultValue) {
      this.node.value = this.props.defaultValue ? this.props.defaultValue : "";
      this.onValue();
    }
  }

  render() {
    return (
      <textarea
        defaultValue={this.props.defaultValue}
        ref={(node) => {
          this.node = node;
        }}
        onInput={(e) => this.onInput(e)}
        onFocus={(e) => this.onFocus(e)}
        onBlur={(e) => this.onBlur(e)}
        onKeyDown={(e) => this.onKeyDown(e)}
      />
    );
  }
}

export const InputTextarea =
  inputWrapper(InputTextareaView);