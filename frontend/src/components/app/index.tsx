import * as React from "react";
import { TypeSelectionConnect } from "@frontend/pages/type-menu";
import { Router, Route, WithRouterProps, withRouter } from "@frontend/components/router";
import { ModalConnect } from "@frontend/components/modal";
import { SlideOutContainerConnect } from "@frontend/containers/slide-out";
import { ColorPickerSpawnConnect } from "@frontend/components/color-picker";
import { dispatch } from "@frontend/action/";
import TodoList from "@frontend/pages/todo-list";
import TodoTags from "@frontend/pages/todo-tags";
import { routes } from "@frontend/routes";
import path from "@path";
import { CategoryListConnect } from "@frontend/pages/category-list";
import { TodoEditorConnect } from "@frontend/pages/todo-editor";
import { NotFound } from "@frontend/pages/not-found";

class AppView extends React.Component<WithRouterProps> {
  componentDidMount() {
    dispatch("CATEGORY", {
      type: "GET_ALL",
    });

    document.addEventListener("keydown", function (e) {
      if (e.which === 91) {
        dispatch("KEYDOWN_CTRL");
      }
    });

    document.addEventListener("keyup", function (e) {
      if (e.which === 91) {
        dispatch("KEYUP_CTRL");
      }
    });
  }

  render() {
    const params = path.params(this.props.location.pathname, routes.pathname);
    const className = ["app"];

    if (params.type) {
      className.push("app-type");
    }

    if (params.categoryID) {
      className.push("app-category-id");
    }

    if (params.todoID) {
      className.push("app-todo-id");
    }

    return (
      <div className={className.join(" ")}>
        <Router>
          <Route
            pathname={"/"}
            component={TypeSelectionConnect}/>
          <Route
            pathname={path.slice(routes.pathname, 0, 1)}
            component={CategoryListConnect}/>
          <Route
            pathname={routes.todo}
            component={TodoList} />
          <Route
            pathname={path(routes.pathname).replace({
              type: "todo",
            }).value}
            component={TodoEditorConnect} />
          <Route
            pathname={routes.tags}
            component={TodoTags} />
          <Route pathname="/" component={NotFound}/>
        </Router>
        <ModalConnect />
        <SlideOutContainerConnect />
        <ColorPickerSpawnConnect />
      </div>
    );
  }
}

export const App = withRouter<{}>(AppView);
export { routes };