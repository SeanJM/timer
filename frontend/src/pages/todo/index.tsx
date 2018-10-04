import React, { Component } from "react";
import { withStore } from "@frontend/store";
import { StoreState } from "@frontend/store";
import { TodoEditorConnect } from "./todo-editor";
import { TodoNotFound } from "./todo-not-found";
import { TodoListConnect } from "./todo-list";
import { WithRouterProps } from "@frontend/components/router";
import { PanelGroup, Panel } from "@frontend/components/panel-group";
import { dispatch } from "@frontend/action";
import { path, PathParams } from "@path";

type TodoPathParams = PathParams<{
  categoryID: string;
  todoID: string;
}>;

type TodoPathInParams = PathParams<{
  categoryID: string;
  elementID: string;
}>;

interface TodoInProps extends WithRouterProps {
  params: TodoPathInParams;
}

interface TodoOutProps extends WithRouterProps {
  params: PathParams<TodoPathParams>;
  todoExists: boolean;
  todoEditorDefaultWidth: number;
}

function mapStateToProps(state: StoreState, props: TodoInProps): TodoOutProps {
  const params: TodoPathInParams = path.params(props.location.pathname, state.routes.schema);
  const category = state.todo.categories.find(a => a.id === params.categoryID);
  const todo = category.todos.find(a => a.id === params.elementID);
  return {
    ...props,
    params: {
      categoryID: params.categoryID,
      todoID: params.elementID,
    },
    todoExists: !!todo,
    todoEditorDefaultWidth: state.layout.todoEditorDefaultWidth,
  };
}

export class Todo extends Component<TodoOutProps, {}> {
  render() {
    const { todoID } = this.props.params;
    return (
      <PanelGroup>
        <Panel>
          <TodoListConnect {...this.props}/>
        </Panel>
        { todoID
          ? (
            <Panel
              defaultWidth={this.props.todoEditorDefaultWidth}
              onWidthChanged={(e) => {
                dispatch("LAYOUT", {
                  type: "SET_WIDTH",
                  value: {
                    target: "todoEditorDefaultWidth",
                    defaultWidth: e.width,
                  }
                });
              }}
            >
              {this.props.todoExists
                ? <TodoEditorConnect {...this.props}/>
                : <TodoNotFound {...this.props}/>}
            </Panel>
          )
          : null}
      </PanelGroup>
    );
  }
}

export const TodoConnect = withStore(Todo, mapStateToProps)();