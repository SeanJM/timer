import React from "react";
import generateHash from "@generate-hash";
import path from "@path";
import sortObjectBy from "@sort-object-by";
import _ from "lodash";

import { Button } from "@frontend/components/button";
import { ChipData } from "@frontend/components/chip";
import { CodeMirror } from "@frontend/components/code-mirror";
import { dispatch } from "@frontend/action";
import { emptyForm } from "@frontend/action/form";
import { FormConnect } from "@frontend/components/form";
import { InputChipSelect } from "@frontend/components/input/input-chip-select";
import { InputGroup } from "@frontend/components/input-group";
import { InputSlide } from "@frontend/components/input/input-slide";
import { InputText } from "@frontend/components";
import { RouteComponentProps } from "@frontend/components/router";
import { TagResponse, TodoResponse } from "@types";
import { TitleAndInput } from "@frontend/components/title-and-input";
import { Titlebar } from "@frontend/components/titlebar";
import { Viewport } from "@frontend/components/viewport";
import { withStore, StoreState, StoreForm } from "@frontend/store";

const FORM_ID = generateHash();

const EMPTY_TODO_RESPONSE: TodoResponse = {
  completedDate: null,
  name: null,
  tags: [],
  progress: null,
  priority: null,
  notes: null
};

interface TodoEditorProps
  extends RouteComponentProps {
  todoName: string;
  todoTags: string[];

  todoProgressIndex: number;
  todoProgressLength: number;

  todoPriorityIndex: number;
  todoPriorityLength: number;

  todoNotes: string;

  categoryName: string;
  categoryID: string;
  todoID: string;
  tags: TagResponse[];

  form: StoreForm;
  formInputTodoName: string | null;
  formInputTodoTags: string[] | null;
  formInputTodoPriority: number | null;
  formInputTodoNotes: string | null;
}

function mapStateToProps(state: StoreState, props: RouteComponentProps): TodoEditorProps {
  const { categoryID, todoID } = props.params;

  const category =
    state.todo.categories.find((a) => a.id === categoryID);

  const form =
    state.form[FORM_ID] || emptyForm(FORM_ID);

  const todo =
    category.todos.find((a) => a.id === todoID) ||
    EMPTY_TODO_RESPONSE;

  console.log(category.tags);

  return {
    history: props.history,
    location: props.location,
    params: props.params,
    query: props.query,

    todoNotes: todo.notes,
    todoName: todo.name,
    todoTags: todo.tags.sort((a, b) => a.toLowerCase() > b.toLowerCase() ? 1 : -1),
    todoProgressIndex: todo.progress,
    todoProgressLength: 5,

    todoPriorityIndex: todo.priority,
    todoPriorityLength: 3,

    categoryName: category.name,
    categoryID,
    todoID,
    tags: category.tags.slice().sort(sortObjectBy("name")),

    form: state.form[FORM_ID] || emptyForm(FORM_ID),
    formInputTodoName: form.input.todoName ? form.input.todoName.value : null,
    formInputTodoPriority: form.input.todoPriority ? form.input.todoPriority.value : null,
    formInputTodoTags: form.input.todoTags ? form.input.todoTags.value : null,
    formInputTodoNotes: form.input.todoNotes ? form.input.todoNotes.value : null,
  };
}

class TodoEditor extends React.Component<TodoEditorProps> {
  constructor(props) {
    super(props);
    this.save = _.debounce(this.save.bind(this), 500);
  }

  save() {
    const {
      formInputTodoName,
      formInputTodoNotes,
      formInputTodoPriority,
      formInputTodoTags,
    } = this.props;

    dispatch("TODO", {
      type: "EDIT",
      value: {
        categoryID: this.props.categoryID,
        todoID: this.props.todoID,
        name: formInputTodoName || this.props.todoName,
        tags: formInputTodoTags,
        notes: formInputTodoNotes,
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
    const saveTags = prevProps.formInputTodoTags && this.props.formInputTodoTags.length !== prevProps.formInputTodoTags.length;
    if (prevProps.todoID === this.props.todoID) {
      if (saveTags) {
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
  }

  render() {
    const { history, location } = this.props;
    return (
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
              name="todoName"
              defaultValue={this.props.todoName}
              title={this.props.formInputTodoName || this.props.todoName}
              component={InputText}
              onSubmit={() => this.save()}
              onValue={(e) => {
                dispatch("FORM_VALUE", {
                  id: FORM_ID,
                  ...e,
                });
            }}
            />
          </Titlebar>
        }
        body={
          <div>
            <FormConnect type="borderless" id={FORM_ID}>
              <InputGroup>
                <label>Todo tags</label>
                <InputChipSelect
                  name="todoTags"
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
              <InputGroup>
                <label>Priority</label>
                <InputSlide
                  name="todoPriority"
                  onInput={() => this.save()}
                  length={this.props.todoPriorityLength}
                  defaultValue={this.props.todoPriorityIndex}
                />
              </InputGroup>
              <InputGroup>
                <label>Notes</label>
                <CodeMirror
                  name="todoNotes"
                  mode="markdown"
                  lineWrapping={true}
                  onInput={() => this.save()}
                  defaultValue={this.props.todoNotes}
                />
              </InputGroup>
            </FormConnect>
          </div>
        }
      />
    );
  }
}

export const TodoEditorConnect =
  withStore(TodoEditor as React.ComponentType, mapStateToProps)();