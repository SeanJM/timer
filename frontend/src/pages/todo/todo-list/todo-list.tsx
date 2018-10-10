import React, { Component } from "react";

import indexesOfWords from "@strings/indexes-of-words";
import { Button } from "@components/button";
import { CategorySortBy, CategoryFilterBy, FilterTagTypes } from "@types";
import { ContextMenuFilterConnect } from "./context-menu-filter";
import { contextMenuPush } from "@components/context-menu";
import { ContextMenuSort } from "./context-menu-sort";
import { dispatch } from "@frontend/action";
import { emptyForm } from "@frontend/action/form";
import { Filter } from "@components/filter";
import { InputText } from "@components/input";
import { List } from "@components/list";
import { RouteComponentProps } from "@components/router";
import { routes } from "@frontend/routes";
import { TabBar, Tab } from "@components/tab-bar";
import { TitleAndInput } from "@components/title-and-input";
import { Titlebar } from "@components/titlebar";
import { Todo } from "@components/todo";
import { TodoListProgress } from "./todo-list-progress";
import { TodoResponse, FilterResponse } from "types";
import { Viewport } from "@components/viewport";

import { withStore, StoreState, StoreForm, StoreFormInput } from "@frontend/store";
import generateHash from "@generate-hash";
import path, { PathQueryValue, PathParams } from "@path";
import { Control } from "@frontend/components";
import { Icon } from "@components/icon";

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
  showAlt: boolean;
  name: string;
  priorityLength: number;
  sortBy: CategorySortBy | "";
  tagFilters: { [key in FilterTagTypes]: string[] };
  filterBy: CategoryFilterBy;
  todos: TodoResponse[];
  completeTodos: TodoResponse[];
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
    ? indexesOfWords(todo.name, search) !== -1
    : true;
}

function applyFilter(filter: FilterResponse | null, todo: TodoResponse) {
  const tagFilters = filter && filter.tagFilters;

  if (filter) {
    let todoIncludes = todo.tags.filter((tagID) => tagFilters.includes.indexOf(tagID) > -1);
    let todoExcludes = todo.tags.filter((tagID) => tagFilters.excludes.indexOf(tagID) > -1);
    let todoHasAny = todo.tags.filter((tagID) => tagFilters.any.indexOf(tagID) > -1);

    let hasTags =
      todoExcludes.length === 0 &&
      todoIncludes.length === tagFilters.includes.length &&
      (tagFilters.any.length ? todoHasAny.length : true);

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

  return {
    ...props,
    params,
    priorityLength: state.todo.todoSettings.priorityLength,
    categoryID,
    form,
    showAlt: state.shortcut === "ALT",
    tagFilters: filter && filter.tagFilters,
    name: category && category.name,
    sortBy: category && category.sortBy,
    filterBy: category && category.filterBy,
    todos: filteredTodos,
    completeTodos: filteredTodos.filter(isComplete),
    incompleteTodos: filteredTodos.filter(isIncomplete),
    input: form.input.todo_value || { name: "todo_value", value: undefined },
    todoID: params.todoID,
  };
}

class TodoListView extends Component<TodoListOutProps, {}> {
  node: HTMLInputElement;

  handleChange() {
    const { filterBy, query, history } = this.props;
    history.push({
      query: {
        ...query,
        filterBy,
        view: query.view || "incomplete",
      }
    });
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
      tagFilters,
      history,
      params,
      priorityLength,
      showAlt,
      query,
    } = this.props;

    return (
      <Viewport
        titlebar={
          <Titlebar
            secondaryAction={
              <InputText
                defaultValue={this.props.query.search}
                icon={<Icon type="search"/>}
                name="search"
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
                  tags: tagFilters && tagFilters.includes.concat(tagFilters.any),
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
                    ...query,
                    view: "complete"
                  }
                })}>Complete</Tab>

              <Tab
                isActive={query.view === "incomplete"}
                onClick={() => history.push({
                  query: {
                    ...query,
                    view: "incomplete"
                  }
                })}>Incomplete</Tab>

              <Tab
                isActive={query.view === "all"}
                onClick={() => history.push({
                  query: {
                    ...query,
                    view: "all"
                  }
                })}>All</Tab>
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
                    completedDate={todo.completedDate}
                    created={todo.created}
                    history={history}
                    id={todo.id}
                    isActive={params.todoID === todo.id}
                    key={todo.id}
                    priority={todo.priority}
                    priorityLength={priorityLength}
                    search={query.search}
                    showAlt={showAlt}
                    state={todo.state}
                    title={todo.name}
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
                    priority={todo.priority}
                    priorityLength={priorityLength}
                    search={query.search}
                    showAlt={showAlt}
                    state={todo.state}
                    title={todo.name}
                  />
                ))
              }
            </List>
            <List id="all">
              {this.props.todos
                .sort((a, b) => this.sortBy(a, b))
                .map((todo) => (
                  <Todo
                    categoryID={categoryID}
                    completedDate={todo.completedDate}
                    created={todo.created}
                    history={history}
                    id={todo.id}
                    isActive={params.todoID === todo.id}
                    key={todo.id}
                    priority={todo.priority}
                    priorityLength={priorityLength}
                    search={query.search}
                    showAlt={showAlt}
                    state={todo.state}
                    title={todo.name}
                  />
                ))
              }
            </List>
          </Filter>
        }
        feet={
          <TodoListProgress
            incompleteTodos={this.props.incompleteTodos}
            completeTodos={this.props.completeTodos}
          />
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