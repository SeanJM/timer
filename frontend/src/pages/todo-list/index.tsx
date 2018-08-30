import React, { Component, Fragment } from "react";
import Button from "@frontend/components/button";
import { dispatch } from "@frontend/action";
import { Input } from "@frontend/components/input";
import { FormConnect } from "@frontend/components/form";
import { RouterProps } from "@frontend/components/router";
import Titlebar from "@frontend/components/titlebar";
import { Viewport } from "@frontend/components/viewport";
import generateId from "@generate-id";
import { withStore, StoreState } from "@frontend/store";
import { StoreForm, StoreFormInput } from "@types";
import Todo from "@frontend/components/todo";
import path from "@path";
import { routes } from "@frontend/routes";
import { TodoResponse } from "types";
import { emptyForm } from "@frontend/action/form";

const FORM_ID = generateId();

interface State {
  todo: string;
}

interface TodoProps {
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

function mapStateToProps(state: StoreState, props: RouterProps): TodoProps {
  const form = state.form[FORM_ID] || emptyForm(FORM_ID);
  const categoryID = props.params.categoryID;

  const category =
    state.todo.categories
      .find((category) => category.id === categoryID);

  const params =
    path.params(props.location.pathname, routes.pathname);

  return {
    categoryID,
    form,
    controlPressed: state.keys.control,
    name: category && category.name,
    completeTodos: category && category.todos.filter(isComplete),
    incompleteTodos: category && category.todos.filter(isIncomplete),
    input: form.input.todo_value || { name: "todo_value", value: undefined },
    todoID: params.todoID,
  };
}

class TodoList extends Component<TodoProps, State> {
  node: HTMLInputElement;

  constructor(props) {
    super(props);
    this.state = {
      todo: ""
    };
  }

  addTodo() {
    const { input } = this.props;
    if (input.value) {
      this.node.value = "";
      dispatch("ADD_TODO", {
        categoryID: this.props.categoryID,
        value: input.value,
      });
    }
  }

  openSlideOut(categoryID: string, todoID: string) {
    dispatch("OPEN_SLIDEOUT", {
      type: "TODO",
      value: {
        categoryID,
        todoID,
      },
    });
  }

  componentDidMount() {
    if (this.props.todoID) {
      setTimeout(() => {
        this.openSlideOut(this.props.categoryID, this.props.todoID);
      }, 200);
    }
  }

  componentWillReceiveProps(nextProps: TodoProps) {
    if (!this.props.todoID && nextProps.todoID) {
      this.openSlideOut(nextProps.categoryID, nextProps.todoID);
    } else if (this.props.todoID && !nextProps.todoID) {
      dispatch("CLOSE_SLIDEOUT");
    }
  }

  render() {
    return (
      <div className="todo-list">
        <div className="todo-titlebar">
        </div>
        <Viewport
          titlebar={
            <Titlebar left={<h6>{this.props.name}</h6>} />
          }
          toolbar={
            <Titlebar center={
              <FormConnect id={FORM_ID} onSubmit={() => this.addTodo()}>
                <Input
                  onRef={(node) => { this.node = node as HTMLInputElement;}}
                  type="text"
                  formID={FORM_ID}
                  name="todo_value"
                  onValue={value => this.setState({ todo: value })}
                  button={
                    <Button
                    icon="add"
                    onClick={() => this.addTodo()}
                    />
                  }
                />
              </FormConnect>
            } />
          }
          body={
            <Fragment>
              <Titlebar left={<h6>Complete</h6>} />
              {this.props.completeTodos.map((todo) => (
                <Todo
                  key={todo.id}
                  state={todo.state}
                  name={todo.name}
                  created={todo.created}
                  id={todo.id}
                  categoryID={this.props.categoryID}
                  showAlt={this.props.controlPressed}
                />
              ))}
              <Titlebar left={<h6>Incomplete</h6>} />
              {this.props.incompleteTodos.map((todo) => (
                <Todo
                  key={todo.id}
                  state={todo.state}
                  name={todo.name}
                  created={todo.created}
                  id={todo.id}
                  categoryID={this.props.categoryID}
                  showAlt={this.props.controlPressed}
                />
              ))}
            </Fragment>
          }
        />
      </div >
    );
  }
}

export default withStore(TodoList, mapStateToProps)() as React.ComponentClass<any>;