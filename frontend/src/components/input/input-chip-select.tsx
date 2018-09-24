import React, { Component } from "react";
import { ChipFilter, ChipData, ChipFilterInputEvent } from "@frontend/components/chip";
import { InputWrapper } from "@frontend/components/input";
import { InputValueEvent } from "@types";

interface State {
  focus: boolean;
}

export interface ChipSelectProps {
  data: ChipData[];
  formid?: string;
  name?: string;
  onValue?: (e: InputValueEvent) => void;
  onInput?: (e?: ChipFilterInputEvent) => void;
  defaultValue?: string[];
}

export class InputChipSelect extends Component<ChipSelectProps, State> {
  constructor(props) {
    super(props);
    this.state = {
      focus: false
    };
  }

  render() {
    const { onValue, onInput, defaultValue } = this.props;
    return (
      <InputWrapper
        type="chip-select"
        focus={this.state.focus}>
        <ChipFilter
          data={this.props.data}
          defaultValue={defaultValue}
          onInput={(e) => {
            if (onInput) {
              onInput(e);
            }
          }}
          onValue={(value) => {
            if (onValue) {
              onValue({
                value,
                type: "Array<string|undefined>",
                name: this.props.name,
              });
            }
          }}
        />
      </InputWrapper>
    );
  }
}