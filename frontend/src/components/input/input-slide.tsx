import React from "react";
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

function InputSlideView(props: InputSlideProps) {
  const {
    defaultValue,
    length,
    name,
    onBlur,
    onFocus,
    onInput,
    onValue,
  } = props;

  return (
    <Slide
      defaultValue={defaultValue}
      length={length}
      name={name}

      onBlur={onBlur}
      onFocus={onFocus}
      onInput={onInput}
      onValue={onValue}
    />
  );
}

export const InputSlide =
  inputWrapper<InputSlideProps>(InputSlideView);