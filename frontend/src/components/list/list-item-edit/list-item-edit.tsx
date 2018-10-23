import React from "react";
import { ListItem } from "../list-item";
import { ListItemEditInput } from "./list-item-edit-input";
import { DoubleClick } from "@components/double-click";
import { InputValueEvent } from "@types";

class ListItemEdit extends React.Component<ListItemEdit.Props, ListItemEdit.State> {
  value: string;

  constructor(props) {
    super(props);

    this.state = {
      edit: props.edit,
      value: props.title,
    };

    this.value = null;
  }

  dispatchCancel = () => {
    this.value = this.state.value;
    this.setState({
      edit: false,
    });
  }

  dispatchSubmit = () => {
    this.setState({
      edit: false,
      value: this.value,
    });

    this.props.onSubmit({
      name: this.props.name,
      type: "string",
      value: this.value,
    });
  }

  dispatchValue = ({ value }) => {
    this.value = value;
  }

  dispatchDoubleClick = () => {
    this.setState({
      edit: true
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.edit !== this.props.edit) {
      this.setState({
        edit: this.props.edit
      });
    }

    if (prevProps.title !== this.props.title) {
      this.setState({
        value: this.props.title
      });
    }
  }

  render() {
    const classList = [];

    if (this.state.edit) {
      classList.push("list-item--edit");
    }

    return (
      <DoubleClick onDoubleClick={this.dispatchDoubleClick}>
        <ListItem
          className={classList.join(" ")}
          title={this.state.value}
          id={this.props.id}
        >
          {this.state.edit
            ? <ListItemEditInput
              onCancel={this.dispatchCancel}
              onSubmit={this.dispatchSubmit}
              onValue={this.dispatchValue}
              defaultValue={this.state.value}
            />
            : null}
        </ListItem>
      </DoubleClick>
    );
  }
}

namespace ListItemEdit {
  export interface Props {
    edit?: boolean;
    id: string;
    name?: string;
    onSubmit: (e: InputValueEvent) => void;
    title: string;
  }

  export interface State {
    edit?: boolean;
    value?: string;
  }
}

export { ListItemEdit };