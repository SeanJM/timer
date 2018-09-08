import React, { Component } from "react";
import { ChipFilter, ChipData } from "@frontend/components/chip";
import { InputWrapper } from "@frontend/components/input";

interface State {
  focus: boolean;
}

export interface ChipSelectProps {
  data: ChipData[];
  formid?: string;
  name?: string;
  onValue?: (value: any[], type: string) => void;
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
    const { onValue, defaultValue } = this.props;
    return (
      <InputWrapper
        type="chip-select"
        focus={this.state.focus}>
        <ChipFilter
          data={this.props.data}
          defaultValue={defaultValue}
          onValue={(value) => {
            if (onValue) {
              onValue(value, "Array<string|undefined>");
            }
          }}
        />
      </InputWrapper>
    );
  }
}