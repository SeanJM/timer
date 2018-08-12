import * as React from "react";
import { InputType } from "@components/input";

interface InputWrapperProps extends JSX.ElementChildrenAttribute {
  focus: boolean;
  type: InputType;
  button?: JSX.Element;
  label?: string;
}

export function InputWrapper(props: InputWrapperProps) {
  const className = [
    "input-wrapper",
    "input-wrapper-" + props.type
  ];

  if (props.focus) {
    className.push("input-wrapper--focus");
  }

  if (props.button) {
    className.push("input-wrapper-button");
  }

  return (
    <div className={className.join(" ")}>
      {props.label ? <label>{props.label}</label> : null}
      <div className="input-wrapper_input">
        {props.children}
        {props.button}
      </div>
    </div>
  );
}