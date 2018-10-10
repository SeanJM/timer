import * as React from "react";
import { InputValueEvent, Omit } from "@types";

interface InputRequiredProps {
  onValue: (e: InputValueEvent) => void;
  onFocus: (e: React.FocusEvent) => void;
  onBlur: (e: React.FocusEvent) => void;
}

type InputWrapperProps<T> =
  & Omit<T, keyof InputRequiredProps>
  & Partial<InputRequiredProps>
  & Partial<JSX.ElementChildrenAttribute>
  & Partial<{
    className: string;
    control: JSX.Element;
    icon: JSX.Element;
    label: string;
  }>;

interface InputWrapperState {
  hasFocus: boolean;
  hasValue: boolean;
}

export function inputWrapper<T extends InputRequiredProps>(Component: React.ComponentType<T>) {
  return class InputWrapped extends React.Component<InputWrapperProps<T>, InputWrapperState> {
    constructor(props) {
      super(props);
      this.state = {
        hasFocus: false,
        hasValue: false,
      };
    }

    onFocus(e: React.FocusEvent) {
      this.setState({
        hasFocus: true
      });

      if (this.props.onFocus) {
        this.props.onFocus(e);
      }
    }

    onBlur(e: React.FocusEvent) {
      this.setState({
        hasFocus: false
      });

      if (this.props.onBlur) {
        this.props.onBlur(e);
      }
    }

    onValue(e: InputValueEvent) {
      this.setState({
        hasValue: !!e.value.length
      });

      if (this.props.onValue) {
        this.props.onValue(e);
      }
    }

    render() {
      const {
        className,
        control,
        icon,
        label,
      } = this.props;

      const classList = [
        "input-wrapper",
      ];

      if (control) {
        classList.push("input-wrapper-button");
      }

      if (className) {
        classList.push(className);
      }

      if (this.state.hasFocus) {
        classList.push("input-wrapper--focus");
      }

      if (this.state.hasValue) {
        classList.push("input-wrapper--value");
      }

      if (icon) {
        classList.push("input-wrapper--icon");
      }

      if (label) {
        classList.push("input-wrapper--label");
      }

      return (
        <div className={classList.join(" ")}>
          <div className="input-wrapper_input">
            <div className="input-wrapper_face"></div>
            {icon
              ? React.cloneElement(icon, { className: "input-wrapper_icon" })
              : null}
            {label ? <label>{label}</label> : null}
            {
              <Component {...this.props}
                onValue={(e) => this.onValue(e)}
                onFocus={(e) => this.onFocus(e)}
                onBlur={(e) => this.onBlur(e)}
              />
            }
            {control}
          </div>
        </div>
      );
    }
  };
}