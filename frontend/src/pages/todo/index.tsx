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
  editorDefaultWidth: number;
}

function mapStateToProps(state: StoreState, props: WithRouterProps): TodoOutProps {
  const params = path.params(props.location.pathname, state.routes.schema);
  return {
    ...props,
    params: {
      categoryID: params.categoryID,
      todoID: params.elementID,
    },
    editorDefaultWidth: state.layout.todoEditorDefaultWidth,
  };
}

export class Todo extends Component<TodoOutProps, {}> {
  render() {
    console.log(this.props);
    return (
      <PanelGroup>
        <Panel>
          <TodoListConnect {...this.props}/>
        </Panel>
        <Panel
          defaultWidth={this.props.editorDefaultWidth}
          onWidthChanged={(e) => {
            dispatch("LAYOUT", {
              type: "SET_WIDTH",
              value: {
                target: "editorDefaultWidth",
                defaultWidth: e.width,
              }
            });
          }}
        >
          <TodoEditorConnect {...this.props}/>
        </Panel>
      </PanelGroup>
    );
  }
}

export const TodoConnect = withStore(Todo, mapStateToProps)();