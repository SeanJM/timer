import * as React from "react";
import { Component } from "react";
import Titlebar from "@components/titlebar";
import { FormConnect } from "@components/form";
import { InputLabel } from "@components/input-label";
import Button from "@components/button";
import Control from "@components/control";
import { ModalWindow } from "@components/modal/modal-window";
import { dispatch } from "@action";
import { withStore, StoreState, FormElement } from "@store";

interface Props extends Pick<
  StoreState["todo"],
  | "isRequest"
  | "isSuccess"> {
  name: string | undefined;
}

interface State { }

function mapStateToProps(state: StoreState) {
  const form =
    state.form.find((form) => form.id === "add-category") || { inputs: [] };

  const category =
    (form as FormElement).inputs.find((a) => a.name === "category") || { value: "" };

  return {
    name: category.value,
    isRequest: state.todo.isRequest,
    isSuccess: state.todo.isSuccess,
  };
}

export class AddCategory extends Component<Props, State> {
  onClick() {
    dispatch("ADD_CATEGORY", {
      name: this.props.name,
    });
  }

  onCancel() {
    dispatch("MODAL_CLOSE", {
      id: "ADD_CATEGORY"
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.isRequest && !nextProps.isRequest && nextProps.isSuccess) {
      dispatch("MODAL_CLOSE", {
        id: "ADD_CATEGORY"
      });
    }
  }

  render() {
    return (
      <ModalWindow
        head={
          <Titlebar
            left={<h6>Add category</h6>}
          />
        }
        body={
          <div>
            <FormConnect id="add-category">
              <InputLabel
                formID="add-category"
                type="text"
                label="Name"
                name="category" />
            </FormConnect>
          </div>
        }
        feet={
          <Control>
            <Button
              onClick={() => this.onCancel()}
            >Cancel</Button>
            <Button
              type="primary"
              onClick={() => this.onClick()}
            >OK</Button>
          </Control>
        }
      />
    );
  }
}

export const AddCategoryConnect = withStore<Props>(AddCategory, mapStateToProps)();