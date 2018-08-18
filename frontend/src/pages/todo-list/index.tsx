import React, { Component } from "react";
import Button from "@components/button";
import { dispatch } from "@action";
import { Input } from "@components/input";
import { FormConnect } from "@components/form";
import { RouterProps, getParams } from "@components/router";
import Titlebar from "@components/titlebar";
import generateId from "@generate-id";
import { withStore, StoreState, FormElement, TodoNode, FormElementInput } from "@store";
import Todo from "@components/todo";

const FORM_ID = generateId();

const TODO_URL = "/todo/category/:categoryID/:todoID";

const EMPTY_FORM = {
  id: FORM_ID,
  inputs: [],
  isValid: false,
  showValidation: false,
};

interface State {
  todo: string;
}

interface TodoProps {
  categoryID: any;
  form: FormElement;
  controlPressed: boolean;
  name: string;
  completeTodos: TodoNode[];
  incompleteTodos: TodoNode[];
  input: FormElementInput;
  todoID: null | string;
}

function isComplete(todo: TodoNode) {
  return todo.attributes.state === "complete";
}

function isIncomplete(todo: TodoNode) {
  return !isComplete(todo);
}

function mapStateToProps(state: StoreState, props: RouterProps): TodoProps {
  const form = state.form.find((form) => form.id === FORM_ID) || EMPTY_FORM;
  const categoryID = props.params.categoryID;

  const category =
    state.todo.categories
      .find((category) => category.attributes.id === categoryID);

  const todoParams =
    getParams(props.location.pathname, TODO_URL);

  return {
    categoryID,
    form,
    controlPressed: state.keys.control,
    name: category && category.attributes.name,
    completeTodos: category && category.children.filter(isComplete),
    incompleteTodos: category && category.children.filter(isIncomplete),
    input: form.inputs.find((input) => input.name === "todo_value") || { value: undefined },
    todoID: todoParams.todoID,
  };
}

class TodoList extends Component<TodoProps, State> {
  constructor(props) {
    super(props);
    this.state = {
      todo: ""
    };
  }

  addTodo() {
    const { input } = this.props;
    if (input.value) {
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
          <Titlebar left={<h6>{this.props.name}</h6>} />
          <Titlebar center={
            <FormConnect id={FORM_ID}>
              <Input
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
        </div>
        <div className="todo-list_content">
          <div className="todo-list_row">
            <Titlebar left={<h6>Complete</h6>} />
            {this.props.completeTodos.map((todo) => (
              <Todo
                key={todo.attributes.id}
                state={todo.attributes.state}
                name={todo.attributes.name}
                created={todo.attributes.created}
                id={todo.attributes.id}
                categoryID={this.props.categoryID}
                showAlt={this.props.controlPressed}
              />
            ))}
          </div>
          <div className="todo-list_row">
            <Titlebar left={<h6>Incomplete</h6>} />
            {this.props.incompleteTodos.map((todo) => (
              <Todo
                key={todo.attributes.id}
                state={todo.attributes.state}
                name={todo.attributes.name}
                created={todo.attributes.created}
                id={todo.attributes.id}
                categoryID={this.props.categoryID}
                showAlt={this.props.controlPressed}
              />
            ))}
          </div>
        </div>
      </div >
    );
  }
}

export default withStore(TodoList, mapStateToProps)() as React.ComponentClass<any>;