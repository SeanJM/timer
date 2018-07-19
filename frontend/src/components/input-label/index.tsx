import * as React from "react";

interface InputLabelProps {
  type: string;
  label: string;
  defaultValue?: string;
  form?: string;
}

export function InputLabel(props: InputLabelProps) {
  return (
    <div className="input-label">
      <label>{props.label}</label>
      <input type={props.type} defaultValue={props.defaultValue} />
    </div>
  );
}