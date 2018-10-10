import _ from "lodash";
import generateHash from "@generate-hash";
import path, { PathQueryValue } from "@path";
import React from "react";
import sortObjectBy from "@sort-object-by";
import { dispatch } from "@frontend/action";

import { Button } from "@components/button";
import { ChipData } from "@components/chip";
import { Filter } from "@components/filter";
import { FormConnect, FormValue } from "@components/form";
import { InputChipSelect } from "@components/input/input-chip-select";
import { InputGroup } from "@components/input-group";
import { InputSlide, InputText } from "@components/input";
import { MarkdownEditor } from "@components/markdown-editor";
import { RouteComponentProps } from "@components/router";
import { TabBar, Tab } from "@components/tab-bar";
import { TagResponse, TodoResponse } from "@types";
import { TitleAndInput } from "@components/title-and-input";
import { Titlebar } from "@components/titlebar";
import { Viewport } from "@components/viewport";
import { withStore, StoreState } from "@frontend/store";

const FORM_ID = generateHash();

const EMPTY_TODO_RESPONSE: TodoResponse = {
  completedDate: null,
  name: null,
  tags: [],
  progress: null,
  priority: null,
  notes: null
};

interface TodoEditorInProps extends RouteComponentProps {
  query: PathQueryValue<{
    todoEditView:
      | "settings"
      | "notes"
  }>;
}

interface TodoEditorOutProps
  extends TodoEditorInProps {
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
}

function mapStateToProps(state: StoreState, props: TodoEditorInProps): TodoEditorOutProps {
  const { categoryID, todoID } = props.params;

  const category =
    state.todo.categories.find((a) => a.id === categoryID);

  const todo =
    category.todos.find((a) => a.id === todoID) ||
    EMPTY_TODO_RESPONSE;

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
  };
}

class TodoEditor extends React.Component<TodoEditorOutProps> {
  formValue: FormValue<{
    todoName: string;
    todoNotes: string;
    todoPriority: number;
    todoTags: string[];
  }>;

  constructor(props) {
    super(props);
    this.save = _.debounce(this.save.bind(this), 500);
    this.formValue = {};
  }

  handleEvent(e) {
    switch (e.type) {
      case "formchange": {
        this.onFormChange(e.value);
      }
    }
  }

  save() {
    const {
      todoName,
      todoNotes,
      todoPriority,
      todoTags
    } = this.formValue;

    console.log(todoTags);

    dispatch("TODO", {
      type: "EDIT",
      value: {
        categoryID: this.props.categoryID,
        todoID: this.props.todoID,
        name: todoName,
        tags: todoTags,
        notes: todoNotes,
        priority: todoPriority,
      }
    });
  }

  componentDidMount() {
    const { history, query } = this.props;
    if (!query.todoEditView) {
      history.push({
        query: {
          ...query,
          todoEditView: "settings",
        },
      });
    }
  }

  onFormChange(value) {
    this.formValue = value;
  }

  render() {
    const { history, location, query } = this.props;
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
              title={this.formValue.todoName || this.props.todoName}
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
        toolbar={
          <Titlebar>
            <TabBar>
              <Tab
                onClick={() => history.push({
                  query: {
                    ...query,
                    todoEditView: "settings",
                  },
                })}
                isActive={query.todoEditView === "settings"}>Settings</Tab>
              <Tab
                onClick={() => history.push({
                  query: {
                    ...query,
                    todoEditView: "notes",
                  },
                })}
                isActive={query.todoEditView === "notes"}>Notes</Tab>
            </TabBar>
          </Titlebar>
        }
        body={
          <Filter view={query.todoEditView}>
            <FormConnect
              onChange={this}
              type="borderless"
              view="settings"
            >
              <InputGroup>
                <label>Todo tags</label>
                <InputChipSelect
                  defaultValue={this.props.todoTags}
                  onInput={() => this.save()}
                  name="todoTags"
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
                  defaultValue={this.props.todoPriorityIndex}
                  name="todoPriority"
                  onInput={() => this.save()}
                  length={this.props.todoPriorityLength}
                />
              </InputGroup>
            </FormConnect>
            <MarkdownEditor
              defaultValue={this.props.todoNotes}
              view="notes"
              onInput={() => this.save()}
              onValue={(e) => dispatch("FORM_VALUE", {
                type: e.type,
                value: e.value,
                name: "todoNotes",
                id: FORM_ID
              })}
            />
          </Filter>
        }
      />
    );
  }
}

export const TodoEditorConnect =
  withStore(TodoEditor as React.ComponentType, mapStateToProps)();