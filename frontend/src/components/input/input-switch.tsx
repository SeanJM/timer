import React from "react";
import Switch from "@components/switch";
import { Component } from "react";
import { InputValueEvent } from "@types";
import { inputWrapper } from "@components/input/input-wrapper";

interface InputSwitchProps {
  defaultValue?: boolean;
  name?: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onInput?: (e: InputValueEvent) => void;
  onBlur: (e: React.FocusEvent) => void;
  onFocus: (e: React.FocusEvent) => void;
  onValue: (e: InputValueEvent) => void;
}

interface InputSwitchState {
  focus: boolean;
  value: boolean;
}

class InputSwitchView extends Component<InputSwitchProps, InputSwitchState> {
  constructor(props) {
    super(props);
    this.state = {
      value: props.defaultValue,
      focus: false
    };
  }

  onKeyDown(e: React.KeyboardEvent) {
    if (this.props.onKeyDown) {
      this.props.onKeyDown(e);
    }
  }

  onFocus(e: React.FocusEvent) {
    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  }

  onBlur(e: React.FocusEvent) {
    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  }

  onClick() {
    const { onInput, onValue, name } = this.props;
    const value = !this.state.value;

    const evt = {
      name,
      type: "boolean",
      value,
    };

    this.setState({
      value,
    });

    if (onInput) {
      onInput(evt);
    }

    if (onValue) {
      onValue(evt);
    }
  }

  render() {
    return (
      <Switch
        check={this.state.value}
        onFocus={(e) => this.onFocus(e)}
        onBlur={(e) => this.onBlur(e)}
        onClick={() => this.onClick()}
        onKeyDown={(e) => this.onKeyDown(e)}
      />
    );
  }
}

export const InputSwitch =
  inputWrapper<InputSwitchProps>(InputSwitchView);