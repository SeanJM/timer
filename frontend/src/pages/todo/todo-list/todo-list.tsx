import React, { Component } from "react";

import { Button } from "@frontend/components/button";
import { CategorySortBy, CategoryFilterBy } from "@types";
import { ContextMenuFilterConnect } from "./context-menu-filter";
import { contextMenuPush } from "@frontend/components/context-menu";
import { ContextMenuSort } from "./context-menu-sort";
import { dispatch } from "@frontend/action";
import { emptyForm } from "@frontend/action/form";
import { Filter } from "@frontend/components/filter";
import { InputText } from "@frontend/components/input";
import { List } from "@frontend/components/list";
import { RouteComponentProps } from "@frontend/components/router";
import { routes } from "@frontend/routes";
import { TabBar, Tab } from "@frontend/components/tab-bar";
import { TitleAndInput } from "@frontend/components/title-and-input";
import { Titlebar } from "@frontend/components/titlebar";
import { Todo } from "@frontend/components/todo";
import { TodoResponse, FilterResponse } from "types";
import { Viewport } from "@frontend/components/viewport";
import { withStore, StoreState, StoreForm, StoreFormInput } from "@frontend/store";

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

interface TodoQueryValue {
  filterBy: string;
  search: string;
  view: string;
}

interface TodoListInProps extends Pick<RouteComponentProps, "location" | "history" | "params"> {
  query: PathQueryValue<TodoQueryValue>;
  params: PathParams<TodoParams>;
}

interface TodoListOutProps extends TodoListInProps {
  categoryID: any;
  form: StoreForm;
  controlPressed: boolean;
  name: string;
  priorityLength: number;
  completeTodos: TodoResponse[];
  sortBy: CategorySortBy | "";
  filterTags: string[];
  filterBy: CategoryFilterBy;
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

function applySearch(search: string, todo: TodoResponse) {
  return search
    ? todo.name.toLowerCase().indexOf(search) > -1
    : true;
}

function applyFilter(filter: FilterResponse | null, todo: TodoResponse) {
  if (filter) {
    let mappedByID =
      todo.tags.map((tagID) => filter.tags.indexOf(tagID) > -1);

    let hasTags =
      mappedByID.filter((a) => a).length >= filter.tags.length;

    return hasTags;
  }

  return true;
}

function mapStateToProps(state: StoreState, props: TodoListInProps): TodoListOutProps {
  const form = state.form[FORM_ID] || emptyForm(FORM_ID);
  const categoryID = props.params.categoryID;
  const search = props.query.search;

  const category =
    state.todo.categories
      .find((category) => category.id === categoryID);

  const params =
    path.params(props.location.pathname, routes.pathname);

  const filter = category &&
    category.filters.find((a) => a.id === category.filterBy);

  const filteredTodos =
    category.todos.filter((todo) =>
      applyFilter(filter, todo) &&
      applySearch(search, todo)
  );

  const filterTags = filter
    ? filter.tags
    : [];

  return {
    ...props,
    params,
    priorityLength: state.todo.todoSettings.priorityLength,
    categoryID,
    form,
    controlPressed: state.keys.control,
    filterTags,
    name: category && category.name,
    sortBy: category && category.sortBy,
    filterBy: category && category.filterBy,
    completeTodos: filteredTodos.filter(isComplete),
    incompleteTodos: filteredTodos.filter(isIncomplete),
    input: form.input.todo_value || { name: "todo_value", value: undefined },
    todoID: params.todoID,
  };
}

class TodoListView extends Component<TodoListOutProps, {}> {
  node: HTMLInputElement;

  handleChange() {
    const query: { [key: string]: string | null } =
      {
        view: "incomplete",
        ...this.props.query,
        filterBy: this.props.filterBy
      };

    this.props.history.push({ query });
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

  onSearchInput(e: React.FormEvent<HTMLInputElement>) {
    const value = (e.target as HTMLInputElement).value;
    const { history } = this.props;
    history.push({
      query: {
        ...history.last().query,
        search: value
      },
    });
  }

  render() {
    const {
      categoryID,
      filterTags,
      history,
      params,
      priorityLength,
      query,
    } = this.props;

    return (
      <Viewport
        titlebar={
          <Titlebar
            secondaryAction={
              <InputText
                name="search"
                icon="search"
                defaultValue={this.props.query.search}
                onInput={(e) => this.onSearchInput(e)}
              />
            }
          >
            <TitleAndInput
              component={InputText}
              title={this.props.name}
              onSubmit={(name) => dispatch("TODO", {
                type: "ADD",
                value: {
                  categoryID,
                  tags: filterTags,
                  name,
                }
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
                  active={!!this.props.filterBy}
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
                    categoryID={categoryID}
                    created={todo.created}
                    completedDate={todo.completedDate}
                    history={history}
                    id={todo.id}
                    isActive={params.todoID === todo.id}
                    key={todo.id}
                    name={todo.name}
                    priorityLength={priorityLength}
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
                    categoryID={categoryID}
                    created={todo.created}
                    history={history}
                    id={todo.id}
                    isActive={params.todoID === todo.id}
                    key={todo.id}
                    name={todo.name}
                    priorityLength={priorityLength}
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
    );
  }
}

contextMenuPush({
  [CONTEXT_MENU_SORT]: ContextMenuSort,
  [CONTEXT_MENU_FILTER]: ContextMenuFilterConnect,
});

export const TodoListConnect = withStore(TodoListView, mapStateToProps)();