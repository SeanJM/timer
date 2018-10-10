import * as React from "react";
import { Component } from "react";
import { inputWrapper } from "@frontend/components/input/input-wrapper";
import { Slide } from "@frontend/components/slide";
import { InputValueEvent } from "types";

interface InputSlideProps {
  defaultValue?: number;
  label?: string;
  length?: number;
  name?: string;

  onValue: (e: InputValueEvent) => void;
  onInput: (e: InputValueEvent) => void;
  onFocus: (e: React.FocusEvent) => void;
  onBlur: (e: React.FocusEvent) => void;
}

interface InputSlideState {
  value: number;
}

class InputSlideView extends Component<InputSlideProps, InputSlideState> {
  constructor(props) {
    super(props);
    this.state = {
      value: props.defaultValue,
    };
  }

  onInput(e: InputValueEvent) {
    this.setState({
      value: e.value,
    });

    if (this.props.onInput) {
      this.props.onInput(e);
    }

    this.onValue(e);
  }

  onValue(e: InputValueEvent) {
    const { onValue } = this.props;
    if (onValue) {
      onValue(e);
    }
  }

  componentDidUpdate(prevProps: InputSlideProps) {
    if (this.props.defaultValue !== prevProps.defaultValue) {
      this.setState({
        value: this.props.defaultValue
      });

      this.onValue({
        type: "number",
        name: this.props.name,
        value: this.props.defaultValue,
      });
    }
  }

  render() {
    const {
      onBlur,
      onFocus,
    } = this.props;

    return (
      <Slide
        length={this.props.length}
        name={this.props.name}

        onBlur={onBlur}
        onFocus={onFocus}
        onInput={(e) => this.onInput(e)}
        onValue={(e) => this.onValue(e)}
        value={this.state.value}
      />
    );
  }
}

export const InputSlide =
  inputWrapper<InputSlideProps>(InputSlideView);