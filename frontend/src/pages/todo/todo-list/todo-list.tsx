import React, { Component } from "react";
import generateHash from "@generate-hash";
import indexesOfWords from "@strings/indexes-of-words";
import path, { PathQueryValue, PathParams } from "@path";
import { withStore, StoreState, StoreForm, StoreFormInput } from "@store";

import { Button } from "@components/button";
import { CategorySortBy, CategoryFilterBy, FilterTagTypes } from "@types";
import { ContextMenuSort } from "./context-menu";
import { contextMenuPush } from "@components/context-menu";
import { Control } from "@components/control";
import { dispatch } from "@frontend/action";
import { emptyForm } from "@frontend/action/form";
import { Icon } from "@components/icon";
import { InputText } from "@components/input";
import { List } from "@components/list";
import { RouteComponentProps } from "@components/router";
import { routes } from "@frontend/routes";
import { SmartScroll } from "@components/smart-scroll";
import { TabBar, Tab } from "@components/tab-bar";
import { TitleAndInput } from "@components/title-and-input";
import { Titlebar } from "@components/titlebar";
import { Todo } from "@components/todo";
import { TodoListProgress } from "./todo-list-progress";
import { TodoResponse, FilterResponse } from "types";
import { Viewport } from "@components/viewport";
import ShortCut from "@frontend/scripts/shortcut";

const FORM_ID = generateHash();
const CONTEXT_MENU_SORT = generateHash();
const DIALOG_FILTER = generateHash();
const TODO_DELETE_ID = generateHash();

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
  name: string;
  priorityLength: number;
  sortBy: CategorySortBy | "";
  tagFilters: { [key in FilterTagTypes]: string[] };
  filterBy: CategoryFilterBy;
  todos: TodoResponse[];
  filteredTodos: TodoResponse[];
  incompleteTodos: TodoResponse[];
  completeTodos: TodoResponse[];
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

function applyView(query: string, todo: TodoResponse) {
  if (query === "complete") {
    return isComplete(todo);
  } else if (query === "incomplete") {
    return isIncomplete(todo);
  } else if (query === "all") {
    return true;
  }
  return false;
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
    category.filters.find((a) => a.id === props.query.filterBy);

  const todos =
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
    tagFilters: filter && filter.tagFilters,
    name: category && category.name,
    sortBy: category && category.sortBy,
    filterBy: category && category.filterBy,
    todos,
    filteredTodos: todos.filter((todo) => applyView(props.query.view, todo)),
    incompleteTodos: todos.filter(isIncomplete),
    completeTodos: todos.filter(isComplete),
    input: form.input.todo_value || { name: "todo_value", value: undefined },
    todoID: params.todoID,
  };
}

class TodoListView extends Component<TodoListOutProps, {}> {
  node: HTMLInputElement;
  selected: string[];

  handleChange() {
    const { query, history } = this.props;

    const location = {
      query: {
        ...query,
        view: query.view || "incomplete",
      }
    };

    history.push(location);
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

  openFilterDialog = () => {
    dispatch("DIALOG", {
      type: "OPEN",
      value: {
        type: "FILTERS",
        id: DIALOG_FILTER,
        categoryID: this.props.categoryID,
      }
    });
  }

  openSortMenu = () => {
    dispatch("CONTEXT_MENU", {
      type: "OPEN",
      value: {
        id: CONTEXT_MENU_SORT
      }
    });
  }

  addTodo = (name: string) => {
    const { tagFilters } = this.props;
    const { categoryID } = this.props.params;
    dispatch("TODO", {
      type: "ADD",
      value: {
        categoryID,
        tags: tagFilters && tagFilters.includes.concat(tagFilters.any),
        name,
      }
    });
  }

  listDidSelect = (e: List.SelectEvent) => {
    const { history, categoryID } = this.props;
    this.selected = e.selected;
    history.push({
      pathname: path.reduce(routes.pathname, {
        type: "todo",
        categoryID,
        todoID: e.target,
      })
    });
  }

  listOnKeyDown = (e: ShortCut.Event) => {
    const { categoryID } = this.props;
    if (e.name === "DELETE") {
      dispatch("ALERT", {
        type: "PUSH",
        value: {
          type: "TODO_DELETE",
          id: TODO_DELETE_ID,
          categoryID,
          idList: this.selected
        }
      });
    } else if (e.name === "D") {
      dispatch("TODO", {
        type: "COMPLETE",
        value: {
          categoryID,
          idList: this.selected
        }
      });
    } else if (e.name === "U") {
      dispatch("TODO", {
        type: "INCOMPLETE",
        value: {
          categoryID,
          idList: this.selected
        }
      });
    } else if (e.name === "ADD") {
      dispatch("TODO", {
        type: "INCREASE_PRIORITY",
        value: {
          categoryID,
          idList: this.selected,
        }
      });
    } else if (e.name === "MINUS") {
      dispatch("TODO", {
        type: "DECREASE_PRIORITY",
        value: {
          categoryID,
          idList: this.selected,
        }
      });
    }
  }

  viewComplete = () => {
    const { history, query } = this.props;
    history.push({
      query: {
        ...query,
        view: "complete"
      }
    });
  }

  viewIncomplete = () => {
    const { history, query } = this.props;
    history.push({
      query: {
        ...query,
        view: "incomplete"
      }
    });
  }

  viewAll = () => {
    const { history, query } = this.props;
    history.push({
      query: {
        ...query,
        view: "all"
      }
    });
  }

  render() {
    const {
      categoryID,
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
              onSubmit={this.addTodo}
            />
          </Titlebar>
        }
        toolbar={
          <Titlebar
            secondaryAction={
              <Control>
                <Button
                  icon="filter"
                  toggle={!!this.props.filterBy}
                  onClick={this.openFilterDialog}
                />
                <Button
                  icon="sort"
                  onClick={this.openSortMenu}
                />
              </Control>
            }
          >
            <TabBar>
              <Tab
                isActive={query.view === "complete"}
                onClick={this.viewComplete}>Complete</Tab>

              <Tab
                isActive={query.view === "incomplete"}
                onClick={this.viewIncomplete}>Incomplete</Tab>

              <Tab
                isActive={query.view === "all"}
                onClick={this.viewAll}>All</Tab>
            </TabBar>
          </Titlebar>
        }
        body={
          <SmartScroll>
            <List
              multiselect
              onSelect={this.listDidSelect}
              shortcuts={{
                "DELETE": this.listOnKeyDown,
                "D": this.listOnKeyDown,
                "U": this.listOnKeyDown,
                "ADD": this.listOnKeyDown,
                "MINUS": this.listOnKeyDown
              }}
            >
              {this.props.filteredTodos
                .sort((a, b) => this.sortBy(a, b))
                .map((todo) => (
                  <Todo
                    active={params.todoID === todo.id}
                    categoryID={categoryID}
                    completedDate={todo.completedDate}
                    created={todo.created}
                    id={todo.id}
                    key={todo.id}
                    priority={todo.priority}
                    priorityLength={priorityLength}
                    search={query.search}
                    state={todo.state}
                    title={todo.name}
                  />
                ))
              }
            </List>
          </SmartScroll>
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
});

export const TodoListConnect = withStore(TodoListView, mapStateToProps)();