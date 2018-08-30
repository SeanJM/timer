import * as React from "react";
import { InputType } from "@frontend/components/input";

interface InputWrapperProps extends JSX.ElementChildrenAttribute {
  focus: boolean;
  type: InputType;
  button?: JSX.Element;
  className?: string;
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

  if (props.className) {
    className.push(props.className);
  }

  return (
    <div className={className.join(" ")}>
      <div className="input-wrapper_input">
        <div className="input-wrapper_face"></div>
        {props.children}
        {props.button}
      </div>
    </div>
  );
}