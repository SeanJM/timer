import React from "react";
import { withStore, StoreState } from "@frontend/store";
import { FormConnect } from "@frontend/components/form";
import { InputGroup } from "@frontend/components/input-group";
import { TagResponse, StoreForm } from "types";
import generateHash from "@generate-hash";
import { emptyForm } from "@frontend/action/form";
import { InputText } from "@frontend/components";
import { CodeMirror } from "@frontend/components/code-mirror";
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
import _ from "lodash";

const FORM_ID = generateHash();

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
  const category = state.todo.categories.find((a) => a.id === categoryID);
  const form = state.form[FORM_ID] || emptyForm(FORM_ID);
  const todo = category.todos.find((a) => a.id === todoID) || { name: null, tags: null, progress: null, priority: null, notes: null };
  return {
    history: props.history,
    location: props.location,
    params: props.params,
    query: props.query,

    todoNotes: todo.notes,
    todoName: todo.name,
    todoTags: todo.tags,
    todoProgressIndex: todo.progress,
    todoProgressLength: 5,

    todoPriorityIndex: todo.priority,
    todoPriorityLength: 3,

    categoryName: category.name,
    categoryID,
    todoID,
    tags: category.tags.slice().sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1),

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
                console.log(e);
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
              <InputGroup name="todoTags">
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
              <InputGroup name="todoPriority">
                <label>Priority</label>
                <InputSlide
                  onInput={() => this.save()}
                  length={this.props.todoPriorityLength}
                  defaultValue={this.props.todoPriorityIndex}
                />
              </InputGroup>
              <InputGroup name="todoNotes">
                <label>Notes</label>
                <CodeMirror
                  mode="markdown"
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