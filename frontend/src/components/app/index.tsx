import React, { Component } from "react";
import { TypeSelectionConnect } from "@frontend/pages/type-menu";
import { Router, Route } from "@frontend/components/router";
import { ModalConnect } from "@frontend/components/modal";
import { SlideOutContainerConnect } from "@frontend/containers/slide-out";
import { ColorPickerSpawnConnect } from "@frontend/components/color-picker";
import { dispatch } from "@frontend/action/";
import { TodoList } from "@frontend/pages/todo-list";
import { TodoTags } from "@frontend/pages/todo-tags";
import { routes } from "@frontend/routes";
import path from "@path";
import { CategoryListConnect } from "@frontend/pages/category-list";
import { TodoEditorConnect } from "@frontend/pages/todo-editor";
import { NotFound } from "@frontend/pages/not-found";

export class App extends Component {
  handleEvent(e: KeyboardEvent) {
    switch (e.type) {
      case "keydown": {
        if (e.which === 91) {
          dispatch("KEYDOWN_CTRL");
        }
        break;
      }

      case "keyup": {
        if (e.which === 91) {
          dispatch("KEYUP_CTRL");
        }
      }
    }
  }

  componentDidMount() {
    dispatch("CATEGORY", { type: "GET_ALL" });
    document.addEventListener("keydown", this);
    document.addEventListener("keyup", this);
  }

  render() {
    const className = ["app"];
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

export { routes };