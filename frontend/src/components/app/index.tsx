import * as React from "react";
import AppMenuConnect from "@components/app/menu";
import { Router, Route } from "@components/router";
import { ModalConnect } from "@components/modal";
import { SlideOutContainerConnect } from "@containers/slide-out";
import { dispatch } from "@action";
import TodoList from "@pages/todo-list";

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
          <Router>
            <Route
              pathname="/todo/category/:categoryID"
              component={TodoList} />
            <Route pathname="/">
              <div></div>
            </Route>
          </Router>
        </div>
        <ModalConnect />
        <SlideOutContainerConnect />
      </div>
    );
  }
}