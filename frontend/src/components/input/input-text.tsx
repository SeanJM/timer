import * as React from "react";
import { Component } from "react";
import { InputWrapper, InputDefaultProps } from "@frontend/components/input";
import { IconType } from "@frontend/components/icon";

interface InputTextProps extends InputDefaultProps {
  defaultValue?: string;
  label?: string;
  button?: JSX.Element;
  className?: string;
  autofocus?: boolean;
  icon?: IconType;
  name?: string;
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
      onValue({
        name: this.props.name,
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
    this.setState({ focus: true });
  }

  onBlur(e: React.FocusEvent) {
    const { onBlur } = this.props;
    if (onBlur) {
      onBlur(e);
    }
    this.setState({ focus: false });
  }

  componentDidMount() {
    if (this.props.autofocus) {
      this.node.focus();
    }
    this.onValue();
  }

  componentDidUpdate(prevProps: InputTextProps) {
    if (prevProps.defaultValue !== this.props.defaultValue) {
      console.log(this.props.defaultValue);
      this.node.value = this.props.defaultValue ? this.props.defaultValue : "";
      this.onValue();
    }
  }

  render() {
    const {
      button,
      onInput,
      onKeyDown,
      icon,
      className,
    } = this.props;

    return (
      <InputWrapper
        className={className}
        focus={this.state.focus}
        type="text"
        icon={icon}
        button={button}>
        <input
          type="text"
          defaultValue={this.props.defaultValue}
          ref={(node) => {
            this.node = node;
          }}
          onInput={(e) => {
            if (onInput) {
              onInput(e);
            }
            this.onValue();
          }}
          onFocus={(e) => this.onFocus(e)}
          onBlur={(e) => this.onBlur(e)}
          onKeyDown={(e) => onKeyDown && onKeyDown(e)}
        />
      </InputWrapper>
    );
  }
}