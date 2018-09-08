import React, { Component } from "react";
import { ChipData } from "./chip-types";
import { ChipSelect } from "./chip-select";
import _ from "lodash";

export interface ChipFilterProps {
  data: ChipData[];
  defaultValue?: string[];
  onValue?: (value: string[]) => void;
}

export interface ChipFilterState {
  value: string[];
}

export class ChipFilter extends Component<ChipFilterProps, ChipFilterState> {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.defaultValue || [],
    };
  }

  onValue() {
    const { onValue } = this.props;
    if (onValue) {
      onValue(this.state.value);
    }
  }

  componentDidMount() {
    this.onValue();
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.defaultValue, this.props.defaultValue)) {
      this.setState({
        value: this.props.defaultValue
      }, () => this.onValue());
    }
  }

  render() {
    return (
      <div className="chip-filter">
        {this.props.data.map((data) => {
          const isChecked = this.state.value.indexOf(data.id) > -1;
          return (
            <ChipSelect
              id={data.id}
              key={data.id}
              label={data.label}
              color={data.color}
              check={isChecked}
              onClick={() => {
                const value =
                  isChecked
                    ? this.state.value.filter(a => a !== data.id)
                    : this.state.value.concat(data.id);

                if (this.props.onValue) {
                  this.props.onValue(value);
                }

                this.setState({
                  value
                });
              }}
            />
          );
        })}
      </div>
    );
  }
}