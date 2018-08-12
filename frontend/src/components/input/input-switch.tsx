import * as React from "react";
import { Component } from "react";
import { InputWrapper, InputEvents } from "@components/input";
import Switch from "@components/switch";

interface InputSwitchProps extends InputEvents {
  defaultValue?: boolean;
  label?: string;
}

interface InputSwitchState {
  focus: boolean;
  value: boolean;
}

export class InputSwitch extends Component<InputSwitchProps, InputSwitchState> {
  constructor(props) {
    super(props);
    this.state = {
      value: props.defaultValue,
      focus: false
    };
  }

  onClick() {
    const { onInput, onValue } = this.props;
    const value = !this.state.value;

    this.setState({
      value,
    });

    onInput && onInput(value);
    onValue && onValue(value);
  }

  render() {
    const {
      onFocus,
      onBlur,
      onKeyDown,
      label,
    } = this.props;

    return (
      <InputWrapper focus={this.state.focus} type="switch">
        {label
          ? <label onClick={() => this.onClick()}>{label}</label>
          : null}
        <Switch
          check={this.state.value}
          onFocus={(e) => {
            onFocus && onFocus(e);
            this.setState({
              focus: true
            });
          }}
          onBlur={(e) => {
            onBlur && onBlur(e);
            this.setState({
              focus: false
            });
          }}
          onClick={() => this.onClick()}
          onKeyDown={(e) => onKeyDown && onKeyDown(e)}
        />
      </InputWrapper>
    );
  }
}