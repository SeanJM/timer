import * as React from "react";
import { InputText } from "@frontend/components/input/input-text";
import { InputSwitch } from "@frontend/components/input/input-switch";
import { InputChipSelect } from "@frontend/components/input/input-chip-select";
import { dispatch } from "@frontend/action";
import { InputValueEvent } from "@types";

const BYTYPE = {
  text: InputText,
  switch: InputSwitch,
  "chip-select": InputChipSelect,
};

export type InputType =
  | "chip-select"
  | "slide"
  | "switch"
  | "text"
  | "textarea"
  ;

export type InputDefaultProps = {
  onFocus?: (e: React.FormEvent) => void;
  onBlur?: (e: React.FormEvent) => void;
  onInput?: (e: React.FormEvent | any) => void;
  onChange?: (e: React.ChangeEvent | any) => void;
  onKeyDown?: (e: React.FormEvent) => void;
  onValue?: (value: InputValueEvent) => void;
  onRef?: (node: HTMLElement) => void;
};

interface InputProps extends InputDefaultProps {
  type: InputType;
  className?: string;
  defaultValue?: string;
  label?: string;
  formID?: string;
  name?: string;
  button?: JSX.Element;
}

export function Input(props: InputProps) {
  const { onValue, name, formID } = props;
  const InputType = BYTYPE[props.type];
  return (
    <InputType {...props} onValue={(value) => {
      if (onValue) {
        onValue(value);
      }
      if (props.formID && props.name) {
        dispatch("FORM_VALUE", {
          type: props.type,
          id: formID,
          value: value,
          name,
        });
      }
    }} />
  );
}