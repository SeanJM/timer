import React from "react";
import { Icon } from "@frontend/components/icon";

interface CheckboxProps {
  checked: boolean;
  fill?: string;
}

export function Checkbox(props: CheckboxProps) {
  const className = ["checkbox"];
  if (props.checked) {
    className.push("checkbox--checked");
  }
  return (
    <div className={className.join(" ")}>
      {props.checked ? <Icon type="check" fill={props.fill}/> : null}
    </div>
  );
}