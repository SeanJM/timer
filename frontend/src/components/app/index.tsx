import React, { Component } from "react";
import { TypeSelectionConnect } from "@frontend/pages/type-menu";
import { Router, Route } from "@frontend/components/router";
import { ModalContainerConnect } from "@frontend/components/modal";
import { ColorPickerSpawnConnect } from "@frontend/components/color-picker";
import { dispatch } from "@frontend/action/";
import { TodoConnect } from "@frontend/pages/todo";
import { TagConnect } from "@frontend/pages/tag";
import { CategoryListConnect } from "@frontend/pages/category-list";
import { NotFound } from "@frontend/pages/not-found";
import { FilterConnect } from "@frontend/pages/filters";
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
        <Router notfound={NotFound}>
          <Route
            pathname={"/"}
            component={TypeSelectionConnect}/>
          <Route
            pathname={":type/"}
            component={CategoryListConnect}/>
        </Router>

        <div className="app-main">
          <Router>
            <Route
              pathname={"todo/:categoryID/"}
              component={TodoConnect} />
            <Route
              pathname={"tags/:categoryID"}
              component={TagConnect} />
            <Route
              pathname={"filters/:categoryID"}
              component={FilterConnect} />
          </Router>
        </div>

        <ModalContainerConnect />
        <ColorPickerSpawnConnect />
        <ContextMenuContainerConnect />
      </div>
    );
  }
}