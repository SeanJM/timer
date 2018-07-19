import * as React from "react";
import { Component } from "react";
import { Titlebar, Form, InputLabel } from "@components";
import { ModalWindow } from "../../modal-window";

interface State { }

export class AddCategory extends Component<{}, State> {
  render() {
    return <ModalWindow
      titlebar={
        <Titlebar title="Add category" />
      }
      content={
        <div>
          <Form>
            <InputLabel type="text" label="Name" />
          </Form>
        </div>
      }
    ></ModalWindow>
  }
}