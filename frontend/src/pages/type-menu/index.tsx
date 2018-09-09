import * as React from "react";
import { withStore, StoreState } from "@frontend/store";
import { routes } from "@frontend/routes";
import { Icon , IconType } from "@frontend/components/icon";
import { AppMenuMappedProps } from "@frontend/pages/type-menu";
import path, { PathParams } from "@path";

import {
  RouterHistory,
  RouterLocation,
  withRouter,
  RouteComponentProps,
} from "@frontend/components/router";

interface MenuParams {
  type: string;
  categoryID?: string;
}

export interface AppMenuProps extends
  Pick<RouteComponentProps,
  | "history"
  | "location"
  > {
  params: PathParams<MenuParams>;
}

export interface AppMenuMappedProps extends AppMenuProps {
  todo: StoreState["todo"];
}

function mapStateToProps(state: StoreState, props: AppMenuProps): AppMenuMappedProps {
  return {
    todo: state.todo,
    history: props.history,
    location: props.location,
    params: path.params(props.location.pathname, routes.pathname) as MenuParams,
  };
}

export class AppMenuView extends React.Component<AppMenuMappedProps, {}> {
  render() {
    const { params } = this.props;
    const className = ["type-menu"];

    if (params.categoryID) {
      className.push("type-menu--category-id");
    } else if (params.type) {
      className.push("type-menu--type");
    }

    return (
      <div className={className.join(" ")}>
        <AppMenuCategories
          params={this.props.params}
          location={this.props.location}
          history={this.props.history}/>
      </div>
    );
  }
}

interface AppMenuCategoriesItemProps {
  isSelected: boolean;
  icon: IconType;
  history: RouterHistory;
  location: RouterLocation;
  label: string;
  type: "todo" | "tags";
}

function AppMenuCategoriesItem(props: AppMenuCategoriesItemProps) {
  const history = props.history;
  const location = props.location;

  const className = [
    "type-menu_categories_item"
  ];

  if (props.isSelected) {
    className.push("type-menu_categories_item-select");
  }

  return (
    <div
      className={className.join(" ")}
      onClick={() => {
        const params =
          path.params(location.pathname, routes.pathname);

        let url = path.reduce(routes.pathname, {
          type: props.type,
          categoryID: params.categoryID,
        });

        history.push(url);
      }}
    >
      <Icon type={props.icon}/>
      <label>{props.label}</label>
    </div>
  );
}

export function AppMenuCategories(props: Pick<AppMenuMappedProps, "params" | "history" | "location">) {
  const location = props.location;
  const params = path.params(location.pathname, routes.pathname);
  return (
    <div className="type-menu_categories">
      <AppMenuCategoriesItem
        history={props.history}
        location={props.location}
        type="todo"
        label="Todo list"
        isSelected={params.type === "todo"}
        icon="book"/>
      <AppMenuCategoriesItem
        location={props.location}
        history={props.history}
        type="tags"
        label="Tag editor"
        isSelected={params.type === "tags"}
        icon="tag"/>
    </div>
  );
}

export const TypeSelectionConnect =
  withStore<AppMenuProps>(AppMenuView, mapStateToProps)(withRouter);