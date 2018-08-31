import * as React from "react";
import { TypeSelectionConnect } from "@frontend/pages/type-menu";
import { Router, Route, WithRouterComponentProps, withRouter } from "@frontend/components/router";
import { ModalConnect } from "@frontend/components/modal";
import { SlideOutContainerConnect } from "@frontend/containers/slide-out";
import { ColorPickerSpawnConnect } from "@frontend/components/color-picker";
import { dispatch } from "@frontend/action/";
import TodoList from "@frontend/pages/todo-list";
import TodoTags from "@frontend/pages/todo-tags";
import { routes } from "@frontend/routes";
import { Fragment } from "react";
import path from "@path";
import { CategoryListConnect } from "@frontend/pages/category-list";

class TagRequester extends React.Component<WithRouterComponentProps> {
  componentDidMount() {
    dispatch("GET_TAGS", {
      categoryID: this.props.params.categoryID,
    });
  }

  componentWillReceiveProps(nextProps: WithRouterComponentProps) {
    if (nextProps.params.categoryID !== this.props.params.categoryID) {
      dispatch("GET_TAGS", {
        categoryID: nextProps.params.categoryID,
      });
    }
  }

  render() {
    return <Fragment/>;
  }
}

class App extends React.Component<WithRouterComponentProps> {
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
    const params = this.props.params;
    let pathLength = 0
    const className = ["app"];

    if (params.pathname && params.pathname[0] !== "") {
      pathLength = params.pathname.length;
    }

    console.log(params.pathname);
    className.push("app-depth-" + pathLength);

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
            pathname={routes.tags}
            component={TodoTags} />
          <Route
            pathname={path.replace(routes.pathname, {
              type: "todo",
            })}
            component={TagRequester}/>
          <Route
            pathname={path.replace(routes.pathname, {
              type: "tags",
            })}
            component={TagRequester}/>
          <Route pathname="/">
            <div></div>
          </Route>
        </Router>
        <ModalConnect />
        <SlideOutContainerConnect />
        <ColorPickerSpawnConnect />
      </div>
    );
  }
}

export default withRouter(App as React.ComponentType);

export { routes };