import React, { Component } from "react";
import { TypeSelectionConnect } from "@frontend/pages/type-menu";
import { Router, Route } from "@frontend/components/router";
import { ModalContainerConnect } from "@frontend/components/modal";
import { ColorPickerSpawnConnect } from "@frontend/components/color-picker";
import { dispatch } from "@frontend/action/";
import { TodoList } from "@frontend/pages/todo-list";
import { TagList } from "@frontend/pages/tag-list";
import { CategoryListConnect } from "@frontend/pages/category-list";
import { TodoEditorConnect } from "@frontend/pages/todo-editor";
import { NotFound } from "@frontend/pages/not-found";
import { TagEditorConnect } from "@frontend/pages/tag-editor/tag-editor";
import { FilterList, FilterEditorConnect } from "@frontend/pages/filters";
import { ContextMenuContainerConnect } from "@frontend/components/context-menu";

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
        <Router basename="todo/">
          <Route
            pathname={":categoryID/"}
            component={TodoList} />
          <Route
            pathname={":categoryID/:todoID/"}
            component={TodoEditorConnect} />
        </Router>

        <Router basename="tags/">
          <Route
            pathname={"/:categoryID"}
            component={TagList} />
          <Route
            pathname={"/:categoryID/:elementID/"}
            component={TagEditorConnect} />
        </Router>

        <Router basename="filters/">
          <Route
            pathname={"/:categoryID"}
            component={FilterList} />
          <Route
            pathname={"/:categoryID/:filterID"}
            component={FilterEditorConnect} />
        </Router>

        <Router notfound={NotFound}>
          <Route
            pathname={"/"}
            component={TypeSelectionConnect}/>
          <Route
            pathname={":type/"}
            component={CategoryListConnect}/>
        </Router>

        <ModalContainerConnect />
        <ColorPickerSpawnConnect />
        <ContextMenuContainerConnect />
      </div>
    );
  }
}