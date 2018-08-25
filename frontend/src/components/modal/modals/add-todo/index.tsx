import * as React from "react";
import { Component } from "react";
import Titlebar from "@components/titlebar";
import { FormConnect } from "@components/form";
import { InputLabel } from "@components/input-label";
import Button from "@components/button";
import Control from "@components/control";
import { ModalWindow } from "@components/modal/modal-window";
import { dispatch } from "@action";
import { withStore, StoreState } from "@store";

interface Props extends Pick<
  StoreState["todo"],
  | "isRequest"
  | "isSuccess"> {
  name: string | undefined;
}

interface State { }

function mapStateToProps(state: StoreState) {
  const form = state.form["add-todo"] || { inputs: [] };
  const category = form.inputs.find(a => a.name === "category") || { value: "" };
  return {
    name: category.value,
    isRequest: state.todo.isRequest,
    isSuccess: state.todo.isSuccess,
  };
}

export class AddTodo extends Component<Props, State> {
  onClick() {
    dispatch("ADD_TODO", {
      name: this.props.name,
    });
  }

  onCancel() {
    dispatch("MODAL_CLOSE", {
      name: "ADD_TODO"
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.isRequest && !nextProps.isRequest && nextProps.isSuccess) {
      dispatch("MODAL_CLOSE", {
        name: "ADD_TODO"
      });
    }
  }

  render() {
    return (
      <ModalWindow
        head={
          <Titlebar
            left={<h6>Add todo</h6>}
          />
        }
        body={
          <div>
            <FormConnect id="add-todo">
              <InputLabel
                formID="add-todo"
                type="text"
                label="Name"
                name="category" />
              <InputLabel
                formID="add-todo"
                type="switch"
                label="Has a due date"
                name="dueDate" />
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

export const AddTodoConnect = withStore<Props>(AddTodo, mapStateToProps)();