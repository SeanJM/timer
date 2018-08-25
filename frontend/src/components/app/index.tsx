import * as React from "react";
import AppMenuConnect from "@frontend/components/app/menu";
import { Router, Route } from "@frontend/components/router";
import { ModalConnect } from "@frontend/components/modal";
import { SlideOutContainerConnect } from "@frontend/containers/slide-out";
import { ColorPickerSpawnConnect } from "@frontend/components/color-picker";
import { dispatch } from "@frontend/action/";
import TodoList from "@frontend/pages/todo-list";
import TodoTags from "@frontend/pages/todo-tags";
import { routes } from "@frontend/routes";

export default class App extends React.Component {
  componentDidMount() {
    dispatch("GET_CATEGORIES");

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
    return (
      <div className="app">
        <AppMenuConnect />
        <div className="app-content">
          <div className="app-content_container">
            <Router>
              <Route
                pathname={routes.todo}
                component={TodoList} />
              <Route
                pathname={routes.tags}
                component={TodoTags} />
              <Route pathname="/">
                <div></div>
              </Route>
            </Router>
          </div>
        </div>
        <ModalConnect />
        <SlideOutContainerConnect />
        <ColorPickerSpawnConnect />
      </div>
    );
  }
}

export { routes };