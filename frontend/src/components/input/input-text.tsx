import * as React from "react";
import { Component } from "react";
import { InputWrapper, InputEvents } from "@frontend/components/input";

interface InputTextProps extends InputEvents {
  defaultValue?: string;
  label?: string;
  button?: JSX.Element;
  className?: string;
  autofocus?: boolean;
}

interface InputTextState {
  focus: boolean;
}

export class InputText extends Component<InputTextProps, InputTextState> {
  node: HTMLInputElement;

  constructor(props) {
    super(props);
    this.state = {
      focus: false
    };
  }

  onValue() {
    const { onValue } = this.props;
    if (onValue) {
      onValue(this.node.value);
    }
  }

  componentDidMount() {
    if (this.props.autofocus) {
      this.node.focus();
    }
    this.onValue();
  }

  render() {
    const {
      button,
      onBlur,
      onFocus,
      onInput,
      onKeyDown,
      onValue,
      className,
    } = this.props;

    return (
      <InputWrapper
        className={className}
        focus={this.state.focus}
        type="text"
        button={button}>
        <input
          type="text"
          defaultValue={this.props.defaultValue}
          ref={(node) => {
            this.node = node;
          }}
          onInput={(e) => {
            const value = (e.target as HTMLInputElement).value.trim();
            if (onInput) {
              onInput(e);
            }
            if (onValue) {
              onValue(value);
            }
          }}
          onFocus={(e) => onFocus && onFocus(e)}
          onBlur={(e) => onBlur && onBlur(e)}
          onKeyDown={(e) => onKeyDown && onKeyDown(e)}
        />
      </InputWrapper>
    );
  }
}