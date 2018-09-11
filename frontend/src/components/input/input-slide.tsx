import * as React from "react";
import { Component } from "react";
import { InputWrapper } from "@frontend/components/input";
import { Slide } from "@frontend/components/slide";

interface InputSlideProps {
  defaultValue?: number;
  label?: string;
  length?: number;
  onValue?: (value: number, type: string) => void;
  onInput?: (value: number) => void;
  onFocus?: (e: React.FocusEvent) => void;
  onBlur?: (e: React.FocusEvent) => void;
}

interface InputSlideState {
  focus: boolean;
  value: number;
}

export class InputSlide extends Component<InputSlideProps, InputSlideState> {
  constructor(props) {
    super(props);
    this.state = {
      value: props.defaultValue,
      focus: false
    };
  }

  componentDidMount() {
    const { onValue } = this.props;
    if (onValue) {
      onValue(this.state.value, "number");
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.defaultValue !== prevProps.defaultValue) {
      this.setState({
        value: this.props.defaultValue
      });
    }
  }

  render() {
    const {
      onFocus,
      onBlur,
      onInput,
      onValue,
      label,
    } = this.props;

    return (
      <InputWrapper focus={this.state.focus} type="slide">
        {label
          ? <label>{label}</label>
          : null}
        <Slide
          length={this.props.length}
          value={this.state.value}
          onValue={(value) => {
            this.setState({
              value
            });
          }}
          onInput={(value) => {
            if (onValue) {
              onValue(value, "number");
            }
            if (onInput) {
              onInput(value);
            }
          }}
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
        />
      </InputWrapper>
    );
  }
}