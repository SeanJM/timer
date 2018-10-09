import * as React from "react";
import { Component } from "react";
import { InputWrapper, InputDefaultProps } from "@frontend/components/input";
import Switch from "@frontend/components/switch";

interface InputSwitchProps extends InputDefaultProps {
  defaultValue?: boolean;
  label?: string;
  name?: string;
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
    const { onInput, onValue, name } = this.props;
    const value = !this.state.value;

    this.setState({
      value,
    });

    if (onInput) { onInput(value); }

    if (onValue) {
      onValue({
        name,
        value,
        type: "boolean",
      });
    }
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
            if (onFocus) { onFocus(e); }
            this.setState({
              focus: true
            });
          }}
          onBlur={(e) => {
            if (onBlur) { onBlur(e); }
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