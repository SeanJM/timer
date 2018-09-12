import * as React from "react";
import { Component } from "react";
import { InputWrapper, InputEvents } from "@frontend/components/input";
import { IconType } from "@frontend/components/icon";

interface InputTextareaProps extends InputEvents {
  defaultValue?: string;
  label?: string;
  button?: JSX.Element;
  className?: string;
  autofocus?: boolean;
  icon?: IconType;
}

interface InputTextareaState {
  focus: boolean;
}

export class InputTextarea extends Component<InputTextareaProps, InputTextareaState> {
  node: HTMLTextAreaElement;

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

  componentDidUpdate(prevProps) {
    if (this.props.defaultValue && prevProps.defaultValue !== this.props.defaultValue) {
      this.node.value = this.props.defaultValue;
    }
  }

  render() {
    const {
      button,
      onInput,
      onKeyDown,
      onValue,
      icon,
      className,
    } = this.props;

    return (
      <InputWrapper
        className={className}
        focus={this.state.focus}
        type="textarea"
        icon={icon}
        button={button}>
        <textarea
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
          onFocus={(e) => this.onFocus(e)}
          onBlur={(e) => this.onBlur(e)}
          onKeyDown={(e) => onKeyDown && onKeyDown(e)}
        />
      </InputWrapper>
    );
  }
}