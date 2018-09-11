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
import { InputSlide } from "@frontend/components/input/input-slide";

const FORM_ID = generateHash();

interface TodoEditorProps
  extends RouteComponentProps {
  todoName: string;
  todoTags: string[];

  todoProgress: number;
  todoProgressLength: number;

  todoPriorityIndex: number;
  todoPriorityLength: number;

  categoryName: string;
  categoryID: string;
  todoID: string;
  tags: TagResponse[];

  form: StoreForm;
  formInputTodoName: string | null;
  formInputTodoTags: string[] | null;
  formInputTodoProgress: number | null;
  formInputTodoPriority: number | null;
}

function mapStateToProps(state: StoreState, props: RouteComponentProps): TodoEditorProps {
  const { categoryID, todoID } = props.params;
  const category = state.todo.categories.find((a) => a.id === categoryID);
  const form = state.form[FORM_ID] || emptyForm(FORM_ID);
  const todo = category.todos.find((a) => a.id === todoID) || { name: null, tags: null, progress: null, priority: null };
  return {
    history: props.history,
    location: props.location,
    params: props.params,
    query: props.query,

    todoName: todo.name,
    todoTags: todo.tags,
    todoProgress: todo.progress,
    todoProgressLength: 5,

    todoPriorityIndex: todo.priority,
    todoPriorityLength: 3,

    categoryName: category.name,
    categoryID,
    todoID,
    tags: category.tags.slice().sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1),

    form: state.form[FORM_ID] || emptyForm(FORM_ID),
    formInputTodoName: form.input.todoName ? form.input.todoName.value : null,
    formInputTodoProgress: form.input.todoProgress ? form.input.todoProgress.value : null,
    formInputTodoPriority: form.input.todoPriority ? form.input.todoPriority.value : null,
    formInputTodoTags: form.input.todoTags ? form.input.todoTags.value : null,
  };
}

class TodoEditor extends React.Component<TodoEditorProps> {
  save() {
    const {
      formInputTodoName,
      formInputTodoTags,
      formInputTodoProgress,
      formInputTodoPriority
    } = this.props;

    dispatch("TODO", {
      type: "EDIT",
      value: {
        categoryID: this.props.categoryID,
        todoID: this.props.todoID,
        name: formInputTodoName || this.props.todoName,
        tags: formInputTodoTags,
        progress: formInputTodoProgress,
        priority: formInputTodoPriority,
      }
    });
  }

  clear() {
    dispatch("FORM", {
      type: "CLEAR",
      value: {
        id: FORM_ID,
      }
    });
  }

  componentWillUnmount() {
    this.clear();
  }

  componentDidUpdate(prevProps) {
    const saveTags = (this.props.formInputTodoTags || []).length !== (prevProps.formInputTodoTags || []).length;
    const saveName = this.props.formInputTodoName !== prevProps.formInputTodoName;
    if (saveName) {
      dispatch("TODO", {
        type: "EDIT",
        value: {
          categoryID: this.props.categoryID,
          todoID: this.props.todoID,
          name: this.props.formInputTodoName || this.props.todoName,
        }
      });
    } else if (saveTags) {
      dispatch("TODO", {
        type: "EDIT",
        value: {
          categoryID: this.props.categoryID,
          todoID: this.props.todoID,
          tags: this.props.formInputTodoTags,
        }
      });
    }
  }

  render() {
    const todoNameValue = this.props.formInputTodoName;
    const { history, location } = this.props;
    return (
      <div className="todo-editor">
        <Viewport
          titlebar={
            <Titlebar
              primaryAction={
                <Button
                  onClick={() => {
                    history.push({
                      pathname: path(location.pathname).pop().value
                    });
                  }}
                  icon="close"
                />
              }
              >
              <TitleAndInput
                icon="edit"
                defaultValue={this.props.todoName}
                title={todoNameValue || this.props.todoName}
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
                    defaultValue={this.props.todoTags}
                    data={this.props.tags.map((tag) => {
                      return {
                        id: tag.id,
                        label: tag.name,
                        color: tag.color,
                      } as ChipData;
                    })}
                  />
                </InputGroup>
                <InputGroup name="todoProgress" formid={FORM_ID}>
                  <label>Progress</label>
                  <InputSlide
                    onInput={() => this.save()}
                    length={this.props.todoProgressLength}
                    defaultValue={this.props.todoProgress}
                  />
                </InputGroup>
                <InputGroup name="todoPriority" formid={FORM_ID}>
                  <label>Priority</label>
                  <InputSlide
                    onInput={() => this.save()}
                    length={this.props.todoPriorityLength}
                    defaultValue={this.props.todoPriorityIndex}
                  />
                </InputGroup>
              </FormConnect>
            </div>
          }
        />
      </div>
    );
  }
}

export const TodoEditorConnect =
  withStore(TodoEditor as React.ComponentType, mapStateToProps)();