import React from "react";
import { withStore, StoreState } from "@frontend/store";
import { FormConnect } from "@frontend/components/form";
import { InputGroup } from "@frontend/components/input-group";
import { TagResponse, StoreForm } from "types";
import generateHash from "@generate-hash";
import { emptyForm } from "@frontend/action/form";
import { InputText } from "@frontend/components";
import { Button } from "@frontend/components/button";
import { ChipData } from "@frontend/components/chip";
import { InputChipSelect } from "@frontend/components/input/input-chip-select";
import { Viewport } from "@frontend/components/viewport";
import { RouteComponentProps } from "@frontend/components/router";
import { TitleAndInput } from "@frontend/components/title-and-input";
import { dispatch } from "@frontend/action";
import { Titlebar } from "@frontend/components/titlebar";
import path from "@path";
import { routes } from "@frontend/components/app";

const FORM_ID = generateHash();

interface SlideOutTodoMappedProps
  extends RouteComponentProps {
  todoName: string;
  todoTags: string[];
  categoryName: string;
  categoryID: string;
  todoID: string;
  tags: TagResponse[];
  form: StoreForm;
  formInputTodoName: string | null;
  formInputTodoTags: string[] | null;
}

function mapStateToProps(state: StoreState, props: RouteComponentProps): SlideOutTodoMappedProps {
  const { categoryID, todoID } = props.params;
  const category = state.todo.categories.find((a) => a.id === categoryID);
  const form = state.form[FORM_ID] || emptyForm(FORM_ID);
  return {
    history: props.history,
    location: props.location,
    params: props.params,
    query: props.query,

    todoName: category.todos.find((a) => a.id === todoID).name,
    todoTags: category.todos.find((a) => a.id === todoID).tags,
    categoryName: category.name,
    categoryID,
    todoID,
    tags: category.tags,
    form: state.form[FORM_ID] || emptyForm(FORM_ID),
    formInputTodoName: form.input.todoName ? form.input.todoName.value : null,
    formInputTodoTags: form.input.todoTags ? form.input.todoTags.value : null,
  };
}

function TodoEditor(props: SlideOutTodoMappedProps) {
  const todoNameValue = props.formInputTodoName;
  const todoTagsValue = props.formInputTodoTags;
  const history = props.history;
  console.log(props.form);
  return (
    <div className="todo-editor">
      <Viewport
        titlebar={
          <Titlebar
            primaryAction={
              <Button
                onClick={() => {
                  history.push({
                    pathname: path.reduce(routes.pathname, {
                      type: "todo",
                      categoryID: props.params.categoryID,
                    })
                  });
                }}
                icon="close"
              />
            }
            secondaryAction={
              <Button icon="save" onClick={() => {
                dispatch("TODO", {
                  type: "EDIT",
                  value: {
                    categoryID: props.categoryID,
                    todoID: props.todoID,
                    name: todoNameValue || props.todoName,
                    tags: todoTagsValue,
                  }
                });
                dispatch("FORM", {
                  type: "CLEAR",
                  value: {
                    id: FORM_ID,
                  }
                });
              }}/>
          }>
            <TitleAndInput
              icon="edit"
              defaultValue={props.todoName}
              title={todoNameValue || props.todoName}
              component={InputText}
              onSubmit={(value) => {
                dispatch("FORM_VALUE", {
                  id: FORM_ID,
                  name: "todoName",
                  type: "text",
                  value: value,
                });
              }}
            />
          </Titlebar>
        }
        body={
          <div>
            <FormConnect type="borderless" id={FORM_ID}>
              <InputGroup name="todoTags" formid={FORM_ID}>
                <label>Todo tags</label>
                <InputChipSelect
                  defaultValue={props.todoTags}
                  data={props.tags.map((tag) => {
                    return {
                      id: tag.id,
                      label: tag.name,
                      color: tag.color,
                    } as ChipData;
                  })}
                />
              </InputGroup>
            </FormConnect>
          </div>
        }
      />
    </div>
  );
}

export const TodoEditorConnect =
  withStore(TodoEditor as React.ComponentType, mapStateToProps)();