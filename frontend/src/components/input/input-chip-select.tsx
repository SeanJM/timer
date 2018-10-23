import React from "react";
import { ChipInput, ChipData, ChipSubmitEvent } from "@frontend/components/chip";
import { inputWrapper } from "@frontend/components/input/input-wrapper";
import { InputValueEvent } from "@types";

export interface ChipSelectProps {
  data: ChipData[];
  defaultValue?: string[];
  formid?: string;
  name?: string;
  onBlur: (e?: React.FocusEvent) => void;
  onFocus: (e?: React.FocusEvent) => void;
  onInput?: (e?: InputValueEvent) => void;
  onSubmit?: (e: ChipSubmitEvent) => void;
  onValue: (e: InputValueEvent) => void;
}

function InputChipSelectView(props: ChipSelectProps) {
  return (
    <ChipInput {...props}/>
  );
}

export const InputChipSelect =
  inputWrapper<ChipSelectProps>(InputChipSelectView);