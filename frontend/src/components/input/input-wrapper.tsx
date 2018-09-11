import * as React from "react";
import { InputType } from "@frontend/components/input";
import { IconType, Icon } from "@frontend/components/icon";

interface InputWrapperProps extends JSX.ElementChildrenAttribute {
  focus: boolean;
  type: InputType;
  button?: JSX.Element;
  className?: string;
  icon?: IconType;
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

  if (props.icon) {
    className.push("input-wrapper--icon");
  }

  if (props.className) {
    className.push(props.className);
  }

  if (props.focus) {
    className.push("input-wrapper--focus");
  }

  return (
    <div className={className.join(" ")}>
      <div className="input-wrapper_input">
        <div className="input-wrapper_face"></div>
        {props.icon ? <Icon className="input-wrapper_icon" type={props.icon}/> : null}
        {props.children}
        {props.button}
      </div>
    </div>
  );
}