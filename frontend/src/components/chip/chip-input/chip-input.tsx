import React, { Component } from "react";
import _ from "lodash";
import generateHash from "@generate-hash";

import { Chip } from "@components/chip";
import { ChipData } from "@components/chip/chip-types";
import { Dropdown, DropdownItem, DropdownChangeEvent } from "@components/dropdown";

import { InputValueEvent } from "@types";
import { KEYNAME_BY_CODE } from "@constants";
import { withStore, StoreState, StoreDropdown } from "@frontend/store";

export interface ChipInputInputEvent {
  type: string;
  value: string[];
}

export interface ChipInputInProps {
  data: ChipData[];
  defaultValue?: string[];
  filter?: string;
  name?: string;
  onBlur?: (e: React.FocusEvent) => void;
  onFocus?: (e: React.FocusEvent) => void;
  onInput?: (e: ChipInputInputEvent) => void;
  onValue?: (e: InputValueEvent<{ value: string[] }>) => void;
}

export interface ChipInputOutProps extends ChipInputInProps {
  dropdown: StoreDropdown;
}

export interface ChipInputState {
  filter: string;
  filteredData: ChipData[];
  inputValue: string;
  showDropdown: boolean;
  value: string[];
}

interface ChipDropdownMenuProps {
  onInput?: (e: DropdownChangeEvent) => void;
  onDropdownDidBlur?: () => void;
  selectedIndex?: number;
  value: string[];
  show?: boolean;
  data: ChipData[];
}

function mapStateToProps(state: StoreState, props: ChipInputInProps): ChipInputOutProps {
  return {
    ...props,
    dropdown: state.dropdown,
  };
}

function ChipDropdownMenu(props: ChipDropdownMenuProps) {
  const { data } = props;
  let i = -1;
  const n = props.data.length;
  const children = [];

  while (++i < n) {
    if (props.value.indexOf(data[i].id) === -1) {
      children.push(
        <DropdownItem key={data[i].id} id={data[i].id}>
          {data[i].label}
        </DropdownItem>
      );
    }
  }

  return (
    <Dropdown
      onInput={props.onInput}
      onBlur={props.onDropdownDidBlur}
      selectedIndex={props.selectedIndex}
      show={props.show}
     >
      {children}
    </Dropdown>
  );
}

export class ChipInputView extends Component<ChipInputOutProps, ChipInputState> {
  dropdownNode: HTMLDivElement;
  input: HTMLInputElement;
  parentNode: HTMLDivElement;
  id: string;

  constructor(props) {
    super(props);
    this.id = generateHash();
    this.state = {
      filter: this.props.filter || "",
      filteredData: this.props.data,
      inputValue: "string",
      showDropdown: false,
      value: this.props.defaultValue || [],
    };
  }

  open() {
    this.setState({
      showDropdown: true
    });
  }

  close() {
    this.setState({
      showDropdown: false
    });
  }

  filterData() {
    const { data } = this.props;
    const filter = this.input.value.toLowerCase();
    const idList = data.map((a) => a.id);
    let i = -1;
    const n = data.length;
    const filtered = [];

    while (++i < n) {
      let isNotSelected = idList.indexOf(data[i].id) !== -1;
      let labelIsMatch = data[i].label.toLowerCase().indexOf(filter) > -1;
      if (isNotSelected && (!filter || labelIsMatch)) {
        filtered.push(data[i]);
      }
    }

    this.setState({
      filteredData: filtered
    });
  }

  onClick(e: React.MouseEvent) {
    if (e.target === this.parentNode) {
      this.input.focus();
    }
  }

  onValue() {
    const { onValue, name } = this.props;
    if (onValue) {
      onValue({
        name,
        type: "Array<string|undefined>",
        value: this.state.value
      });
    }
  }

  onFocus(e: React.FocusEvent) {
    this.open();
    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  }

  onBlur(e: React.FocusEvent) {
    this.close();
    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  }

  filterDidUpdate() {
    this.filterData();
  }

  onBackSpace() {
    const { value } = this.state;
    if (!this.input.value.length) {
      this.setState({
        value: value.slice(0, -1)
      }, () => this.onValue());
    }
  }

  onKeyDown({ which }: React.KeyboardEvent) {
    switch (KEYNAME_BY_CODE[which]) {
      case "BACKSPACE": {
        this.onBackSpace();
      }
    }
  }

  onRemove(removeID: string) {
    const { value } = this.state;
    const { onInput } = this.props;

    if (onInput) {
      onInput({
        type: "input",
        value: this.state.value
      });
    }

    this.setState({
      value: value.filter((chipIDchipID) => chipIDchipID !== removeID)
    }, () => this.onValue());
  }

  onInput(e: DropdownChangeEvent) {
    const { onInput } = this.props;

    this.input.value = "";
    this.filterData();

    if (onInput) {
      onInput({
        type: "input",
        value: this.state.value
      });
    }

    this.setState({
      value: this.state.value.concat(e.id)
    }, () => this.onValue());
  }

  componentDidMount() {
    this.onValue();
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.defaultValue, this.props.defaultValue)) {
      this.setState({
        value: this.props.defaultValue || []
      }, () => this.onValue());
    }
  }

  render() {
    const { data } = this.props;
    const dataById: { [key: string]: ChipData } = _.keyBy(data, "id");
    return (
      <div
        ref={(node) => { this.parentNode = node; }}
        onClick={(e) => this.onClick(e)} className="chip-input">
        {this.state.value
          .map((id) => {
            const data = dataById[id];
            return (
              <Chip
                id={data.id}
                key={data.id}
                label={data.label}
                onRemove={() => this.onRemove(data.id)}
              />
            );
          })
        }
        <input
          ref={(node) => {this.input = node;}}
          className="chip-input_target"
          type="text"
          onKeyDown={(e) => this.onKeyDown(e)}
          onFocus={(e) => this.onFocus(e)}
          onBlur={(e) => this.onBlur(e)}
          onInput={() => this.filterDidUpdate()}
        />
        {this.state.showDropdown
          ? (
            <ChipDropdownMenu
              onDropdownDidBlur={() => this.close()}
              onInput={(e) => this.onInput(e)}
              value={this.state.value}
              show={this.state.showDropdown}
              data={this.state.filteredData}
            />
          )
          : null
        }
      </div>
    );
  }
}

export const ChipInput =
  withStore<ChipInputInProps>(ChipInputView, mapStateToProps)();