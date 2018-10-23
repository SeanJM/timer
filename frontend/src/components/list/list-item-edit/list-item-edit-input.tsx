import React from "react";
import { KEYNAME_BY_CODE } from "@constants";
import { InputValueEvent } from "@types";

class ListItemEditInput extends React.Component<ListItemEditInput.Props> {
  node: HTMLInputElement;

  onRef = (node) => {
    this.node = this.node || node;
  }

  dispatchValue = (e: React.FormEvent) => {
    this.props.onValue({
      name: null,
      type: "string",
      value: this.node.value,
    });
  }

  dispatchKeyDown = (e: React.KeyboardEvent) => {
    const keyname = KEYNAME_BY_CODE[e.which];
    if (keyname === "ENTER") {
      this.props.onSubmit();
    } else if (keyname === "ESC") {
      this.props.onCancel();
    }
  }

  componentDidMount() {
    this.node.focus();
    this.node.setSelectionRange(0, this.node.value.length);
  }

  render() {
    return (
      <input
        onBlur={this.props.onCancel}
        onKeyDown={this.dispatchKeyDown}
        onInput={this.dispatchValue}
        className="list-item-edit-input"
        defaultValue={this.props.defaultValue}
        ref={this.onRef}
        type="text"
      />
    );
  }
}

namespace ListItemEditInput {
  export interface Props {
    defaultValue: string;
    onCancel: () => void;
    onSubmit: () => void;
    onValue: (e: InputValueEvent) => void;
  }
}

export { ListItemEditInput };