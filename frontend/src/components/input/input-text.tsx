import * as React from "react";
import { Component } from "react";
import { InputWrapper, InputEvents } from "@components/input";

interface InputTextProps extends InputEvents {
  defaultValue?: string;
  label?: string;
  button?: JSX.Element;
}

interface InputTextState {
  focus: boolean;
}

export class InputText extends Component<InputTextProps, InputTextState> {
  constructor(props) {
    super(props);
    this.state = {
      focus: false
    };
  }

  render() {
    const {
      button,
      label,
      onBlur,
      onFocus,
      onInput,
      onKeyDown,
      onValue,
      onRef,
    } = this.props;

    return (
      <InputWrapper
        focus={this.state.focus}
        type="text"
        label={label}
        button={button}>
        <input
          type="text"
          defaultValue={this.props.defaultValue}
          ref={(node) => {
            console.log(node);
            onRef && onRef(node);
          }}
          onInput={(e) => {
            const value = (e.target as HTMLInputElement).value.trim();
            onInput && onInput(e);
            onValue && onValue(value);
          }}
          onFocus={(e) => onFocus && onFocus(e)}
          onBlur={(e) => onBlur && onBlur(e)}
          onKeyDown={(e) => onKeyDown && onKeyDown(e)}
        />
      </InputWrapper>
    );
  }
}