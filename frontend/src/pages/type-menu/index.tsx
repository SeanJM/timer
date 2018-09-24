import * as React from "react";
import { withStore, StoreState } from "@frontend/store";
import { Icon , IconType } from "@frontend/components/icon";
import { AppMenuMappedProps } from "@frontend/pages/type-menu";
import path, { PathParams } from "@path";

import {
  RouterHistory,
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

export interface AppMenuMappedProps extends
  AppMenuProps,
  Pick<StoreState, "routes"> {
  todo: StoreState["todo"];
}

function mapStateToProps(state: StoreState, props: AppMenuProps): AppMenuMappedProps {
  return {
    routes: state.routes,
    todo: state.todo,
    history: props.history,
    location: props.location,
    params: path.params(props.location.pathname, state.routes.schema),
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
          routes={this.props.routes}
          params={this.props.params}
          location={this.props.location}
          history={this.props.history}/>
      </div>
    );
  }
}

interface AppMenuCategoriesItemProps {
  history: RouterHistory;
  to: string;
  label: string;
  isSelected: boolean;
  icon: IconType;
}

function AppMenuCategoriesItem(props: AppMenuCategoriesItemProps) {
  const { history, to, isSelected } = props;

  const className = [ "type-menu_categories_item" ];

  if (isSelected) {
    className.push("type-menu_categories_item--select");
  }

  return (
    <div
      className={className.join(" ")}
      onClick={() => history.push(to)}
    >
      <Icon type={props.icon}/>
      <label>{props.label}</label>
    </div>
  );
}

export function AppMenuCategories(props: Pick<AppMenuMappedProps,
  | "params"
  | "history"
  | "location"
  | "routes"
  >) {
  const { params, routes } = props;
  return (
    <div className="type-menu_categories">
      <AppMenuCategoriesItem
        history={props.history}
        to={path.reduce(routes.schema, { type: "todo", categoryID: params.categoryID })}
        label="Todo list"
        isSelected={params.type === "todo"}
        icon="book"/>
      <AppMenuCategoriesItem
        history={props.history}
        to={path.reduce(routes.schema, { type: "tags", categoryID: params.categoryID })}
        label="Tag editor"
        isSelected={params.type === "tags"}
        icon="tag"/>
      <AppMenuCategoriesItem
        history={props.history}
        to={path.reduce(routes.schema, { type: "filters", categoryID: params.categoryID })}
        label="Filters"
        isSelected={params.type === "filters"}
        icon="filter"/>
    </div>
  );
}

export const TypeSelectionConnect =
  withStore<AppMenuProps>(AppMenuView, mapStateToProps)(withRouter);