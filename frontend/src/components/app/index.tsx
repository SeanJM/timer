import * as React from "react";
import AppMenuConnect from "@components/app/menu";
import { Router, Route } from "@components/router";
import { ModalConnect } from "@components/modal";
import { SlideOutContainerConnect } from "@containers/slide-out";
import { dispatch } from "@action";
import TodoList from "@pages/todo-list";
import TodoTags from "@pages/todo-tags";
import * as routes from "./routes";

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
                pathname={routes.actions}
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
      </div>
    );
  }
}

export { routes };