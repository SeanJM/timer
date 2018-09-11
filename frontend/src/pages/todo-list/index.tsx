import React, { Component } from "react";
import { dispatch } from "@frontend/action";
import { RouteComponentProps } from "@frontend/components/router";
import { Titlebar } from "@frontend/components/titlebar";
import { TabBar, Tab } from "@frontend/components/tab-bar";
import { Viewport } from "@frontend/components/viewport";
import generateId from "@generate-id";
import { withStore, StoreState } from "@frontend/store";
import { StoreForm, StoreFormInput } from "@types";
import { Todo } from "@frontend/components/todo";
import path, { PathQueryValue, PathParams } from "@path";
import { routes } from "@frontend/routes";
import { TodoResponse } from "types";
import { emptyForm } from "@frontend/action/form";
import { TitleAndInput } from "@frontend/components/title-and-input";
import { InputText } from "@frontend/components";
import { Filter } from "@frontend/components/filter";
import { List } from "@frontend/components/list";

const FORM_ID = generateId();

interface TodoParams {
  categoryID?: string;
  todoID?: string;
}

interface TodoProps extends Pick<RouteComponentProps, "location" | "history" | "query" | "params"> {
  query: PathQueryValue<{ view?: string}>;
  params: PathParams<TodoParams>;
  categoryID: any;
  form: StoreForm;
  controlPressed: boolean;
  name: string;
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

function mapStateToProps(state: StoreState, props: RouteComponentProps): TodoProps {
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
    categoryID,
    form,
    controlPressed: state.keys.control,
    name: category && category.name,
    completeTodos: category && category.todos.filter(isComplete),
    incompleteTodos: category && category.todos.filter(isIncomplete),
    input: form.input.todo_value || { name: "todo_value", value: undefined },
    todoID: params.todoID,
  } as TodoProps;
}

class TodoListView extends Component<TodoProps, {}> {
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
                <InputText icon="search"/>
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
          }
          body={
            <Filter id={query.view}>
              <List id="complete">
                {this.props.completeTodos.map((todo) => (
                  <Todo
                    isActive={params.todoID === todo.id}
                    history={history}
                    key={todo.id}
                    state={todo.state}
                    name={todo.name}
                    created={todo.created}
                    id={todo.id}
                    categoryID={this.props.categoryID}
                    showAlt={this.props.controlPressed}
                  />
                ))}
              </List>
              <List id="incomplete">
                {this.props.incompleteTodos.map((todo) => (
                  <Todo
                    isActive={params.todoID === todo.id}
                    history={history}
                    key={todo.id}
                    state={todo.state}
                    name={todo.name}
                    created={todo.created}
                    id={todo.id}
                    categoryID={this.props.categoryID}
                    showAlt={this.props.controlPressed}
                  />
                ))}
              </List>
            </Filter>
          }
        />
      </div>
    );
  }
}

export const TodoList = withStore(TodoListView, mapStateToProps)();