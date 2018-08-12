import * as React from "react";
import { Input, InputType } from "@components/input";
import { withStore } from "@store";

interface InputLabelProps {
  type: InputType;
  label: string;
  defaultValue?: string;
  formID?: string;
  name?: string;
}

function mapStateToProps(state, props) {
  const { form, name } = props;
  const input = state.form[form] ? state.form[form][name] : { isValid: true };
  return {
    ...props,
    isValid: input.isValid
  };
}

export function InputLabel(props: InputLabelProps) {
  const {
    label,
    type,
    defaultValue,
    formID,
    name,
  } = props;

  const className = [
    "input-label",
    "input-label-" + type
  ];

  return (
    <div className={className.join(" ")}>
      <Input
        label={label}
        type={type}
        formID={formID}
        name={name}
        defaultValue={defaultValue}
      />
    </div>
  );
}

export const InputLabelC = withStore(InputLabel as React.StatelessComponent, mapStateToProps)();