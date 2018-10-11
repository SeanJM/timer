import React from "react";
import { ChipInput, ChipData } from "@frontend/components/chip";
import { inputWrapper } from "@frontend/components/input/input-wrapper";
import { InputValueEvent } from "@types";

export interface ChipSelectProps {
  data: ChipData[];
  formid?: string;
  name?: string;
  defaultValue?: string[];

  onBlur: (e?: React.FocusEvent) => void;
  onFocus: (e?: React.FocusEvent) => void;
  onInput?: (e?: InputValueEvent) => void;
  onValue: (e: InputValueEvent) => void;
}

function InputChipSelectView(props: ChipSelectProps) {
  return (
    <ChipInput
      data={props.data}
      defaultValue={props.defaultValue}
      name={props.name}

      onBlur={props.onBlur}
      onFocus={props.onFocus}
      onInput={props.onInput}
      onValue={props.onValue}
    />
  );
}

export const InputChipSelect =
  inputWrapper<ChipSelectProps>(InputChipSelectView);