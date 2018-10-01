import React, { Component } from "react";
import { withStore } from "@frontend/store";
import { StoreState } from "@frontend/store";
import { TodoEditorConnect } from "./todo-editor";
import { TodoListConnect } from "./todo-list";
import { WithRouterProps } from "@frontend/components/router";
import { PanelGroup, Panel } from "@frontend/components/panel-group";
import { dispatch } from "@frontend/action";
import { path, PathParams } from "@path";

type TodoPathParams = PathParams<{
  categoryID: string;
  todoID: string;
}>;

interface TodoOutProps extends WithRouterProps {
  params: TodoPathParams;
  todoEditorDefaultWidth: number;
}

function mapStateToProps(state: StoreState, props: WithRouterProps): TodoOutProps {
  const params = path.params(props.location.pathname, state.routes.schema);
  return {
    ...props,
    params: {
      categoryID: params.categoryID,
      todoID: params.elementID,
    },
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
              <TodoEditorConnect {...this.props}/>
            </Panel>
          )
          : null}
      </PanelGroup>
    );
  }
}

export const TodoConnect = withStore(Todo, mapStateToProps)();