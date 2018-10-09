import React, { Component } from "react";
import { ChipInput, ChipData, ChipInputInputEvent } from "@frontend/components/chip";
import { InputWrapper } from "@frontend/components/input/input-wrapper";
import { InputValueEvent } from "@types";

interface State {
  focus: boolean;
}

export interface ChipSelectProps {
  data: ChipData[];
  formid?: string;
  name?: string;
  onValue?: (e: InputValueEvent) => void;
  onInput?: (e?: ChipInputInputEvent) => void;
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
    const { onValue, name, defaultValue } = this.props;
    return (
      <InputWrapper
        type="chip-select"
        focus={this.state.focus}>
        <div className="input-chip-select">
          <ChipInput
            data={this.props.data}
            defaultValue={defaultValue}
            onInput={this.props.onInput}
            onValue={(value) => {
              if (onValue) {
                onValue({
                  name,
                  value,
                  type: "Array<string|undefined>",
                });
              }
            }}
          />
        </div>
      </InputWrapper>
    );
  }
}