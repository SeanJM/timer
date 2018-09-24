import React, { Component } from "react";
import { dispatch } from "@frontend/action";
import { Button } from "@frontend/components/button";
import { emptyForm } from "@frontend/action/form";
import { Filter } from "@frontend/components/filter";
import { InputText } from "@frontend/components/input";
import { List } from "@frontend/components/list";
import { RouteComponentProps } from "@frontend/components/router";
import { routes } from "@frontend/routes";
import { StoreForm, StoreFormInput, CategorySortBy } from "@types";
import { TabBar, Tab } from "@frontend/components/tab-bar";
import { TitleAndInput } from "@frontend/components/title-and-input";
import { Titlebar } from "@frontend/components/titlebar";
import { Todo } from "@frontend/components/todo";
import { TodoResponse } from "types";
import { Viewport } from "@frontend/components/viewport";
import { withStore, StoreState } from "@frontend/store";
import { ContextMenuSort } from "./context-menu-sort";
import { ContextMenuFilterConnect } from "./context-menu-filter";
import { contextMenuPush } from "@frontend/components/context-menu";

import generateHash from "@generate-hash";
import path, { PathQueryValue, PathParams } from "@path";
import { Control } from "@frontend/components";

const FORM_ID = generateHash();
const CONTEXT_MENU_SORT = generateHash();
const CONTEXT_MENU_FILTER = generateHash();

interface TodoParams {
  categoryID?: string;
  todoID?: string;
}

interface TodoListProps extends Pick<RouteComponentProps, "location" | "history" | "query" | "params"> {
  query: PathQueryValue<{ view?: string }>;
  params: PathParams<TodoParams>;
  categoryID: any;
  form: StoreForm;
  controlPressed: boolean;
  name: string;
  priorityLength: number;
  completeTodos: TodoResponse[];
  sortBy: CategorySortBy;
  incompleteTodos: TodoResponse[];
  input: StoreFormInput;
  todoID: null | string;
}

function isComplete(todo: TodoResponse) {
  return todo.state === "complete";
}

function isIncomplete(todo: TodoResponse) {
  return !isComplete(todo);
}

function mapStateToProps(state: StoreState, props: RouteComponentProps): TodoListProps {
  const form = state.form[FORM_ID] || emptyForm(FORM_ID);
  const categoryID = props.params.categoryID;

  const category =
    state.todo.categories
      .find((category) => category.id === categoryID);

  const params =
    path.params(props.location.pathname, routes.pathname);

  return {
    ...props,
    params,
    priorityLength: state.todo.todoSettings.priorityLength,
    categoryID,
    form,
    controlPressed: state.keys.control,
    name: category && category.name,
    sortBy: category.sortBy,
    completeTodos: category && category.todos.filter(isComplete),
    incompleteTodos: category && category.todos.filter(isIncomplete),
    input: form.input.todo_value || { name: "todo_value", value: undefined },
    todoID: params.todoID,
  };
}

class TodoListView extends Component<TodoListProps, {}> {
  node: HTMLInputElement;

  handleChange() {
    if (!this.props.query.view) {
      this.props.history.push({
        query: {
          view: "incomplete"
        }
      });
    }
  }

  componentDidUpdate() {
    this.handleChange();
  }

  componentDidMount() {
    this.handleChange();
  }

  sortBy(a, b) {
    const sortBy = this.props.sortBy;
    if (sortBy === "date") {
      return b.created - a.created;
    } else if (sortBy === "name") {
      return a.name > b.name ? 1 : -1;
    } else if (sortBy === "priority") {
      return b.priority === a.priority
        ? b.created - a.created
        : b.priority - a.priority;
    }
    return 1;
  }

  render() {
    const className = ["todo-list"];
    const { history, query, params } = this.props;

    if (params.categoryID) {
      className.push("todo-list--category-id");
    }

    if (params.todoID) {
      className.push("todo-list--todo-id");
    }

    return (
      <div className={className.join(" ")}>
        <Viewport
          titlebar={
            <Titlebar
              secondaryAction={
                <InputText name="search" icon="search" />
              }
            >
              <TitleAndInput
                component={InputText}
                title={this.props.name}
                onSubmit={(value) => dispatch("ADD_TODO", {
                  categoryID: this.props.categoryID,
                  value,
                })}
              />
            </Titlebar>
          }
          toolbar={
            <Titlebar
              secondaryAction={
                <Control>
                  <Button
                    icon="filter"
                    onClick={() => {
                      dispatch("CONTEXT_MENU", {
                        type: "OPEN",
                        value: {
                          id: CONTEXT_MENU_FILTER
                        }
                      });
                    }}
                  />
                  <Button
                    icon="sort"
                    onClick={() => {
                      dispatch("CONTEXT_MENU", {
                        type: "OPEN",
                        value: {
                          id: CONTEXT_MENU_SORT
                        }
                      });
                    }}
                  />
                </Control>
              }
            >
              <TabBar>
                <Tab
                  isActive={query.view === "complete"}
                  onClick={() => history.push({
                    query: {
                      view: "complete"
                    }
                  })}>Complete</Tab>
                <Tab
                  isActive={query.view === "incomplete"}
                  onClick={() => history.push({
                    query: {
                      view: "incomplete"
                    }
                  })}>Incomplete</Tab>
              </TabBar>
            </Titlebar>
          }
          body={
            <Filter id={query.view}>
              <List id="complete">
                {this.props.completeTodos
                  .sort((a, b) => this.sortBy(a, b))
                  .map((todo) => (
                    <Todo
                      categoryID={this.props.categoryID}
                      created={todo.created}
                      completedDate={todo.completedDate}
                      history={history}
                      id={todo.id}
                      isActive={params.todoID === todo.id}
                      key={todo.id}
                      name={todo.name}
                      priorityLength={this.props.priorityLength}
                      priority={todo.priority}
                      showAlt={this.props.controlPressed}
                      state={todo.state}
                    />
                  ))
                }
              </List>
              <List id="incomplete">
                {this.props.incompleteTodos
                  .sort((a, b) => this.sortBy(a, b))
                  .map((todo) => (
                    <Todo
                      categoryID={this.props.categoryID}
                      created={todo.created}
                      history={history}
                      id={todo.id}
                      isActive={params.todoID === todo.id}
                      key={todo.id}
                      name={todo.name}
                      priorityLength={this.props.priorityLength}
                      priority={todo.priority}
                      showAlt={this.props.controlPressed}
                      state={todo.state}
                    />
                  ))
                }
              </List>
            </Filter>
          }
        />
      </div>
    );
  }
}

contextMenuPush({
  [CONTEXT_MENU_SORT]: ContextMenuSort,
  [CONTEXT_MENU_FILTER]: ContextMenuFilterConnect,
});

export const TodoList = withStore(TodoListView, mapStateToProps)();