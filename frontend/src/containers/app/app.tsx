import React, { Component } from "react";
import { AlertSpawnConnect } from "@containers/alert-spawn";
import { CategoryListConnect } from "@frontend/pages/category-list";
import { ColorPickerSpawnConnect } from "@frontend/components/color-picker";
import { ContextMenuContainerConnect } from "@frontend/components/context-menu";
import { DialogSpawnConnect } from "@containers/dialog-spawn";
import { dispatch } from "@frontend/action/";
import { FilterConnect } from "@frontend/pages/filters";
import { ModalContainerConnect } from "@frontend/components/modal";
import { NotFound } from "@frontend/pages/not-found";
import { Router, Route } from "@frontend/components/router";
import { TagConnect } from "@frontend/pages/tag";
import { TodoConnect } from "@frontend/pages/todo";
import { TypeSelectionConnect } from "@frontend/pages/type-menu";

export class App extends Component {
  componentDidMount() {
    dispatch("CATEGORY", { type: "GET_ALL" });
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

        <AlertSpawnConnect/>
        <ColorPickerSpawnConnect/>
        <ContextMenuContainerConnect/>
        <DialogSpawnConnect/>
        <ModalContainerConnect/>
      </div>
    );
  }
}