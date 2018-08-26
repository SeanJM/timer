import * as React from "react";
import { withStore, StoreState } from "@frontend/store";
import Button from "@frontend/components/button";
import Control from "@frontend/components/control";
import Titlebar from "@frontend/components/titlebar";
import { MenuItem } from "@frontend/components/menu";
import { dispatch } from "@frontend/action/";

import {
  History,
  RouterLocation,
  withRouter,
} from "@frontend/components/router";

import AppMenuCategories from "./app-menu-categories";
import path, { Params } from "@path";
import { routes } from "@frontend/routes";

export interface AppMenuProps {
  history: History;
  location: RouterLocation;
  params: MenuParams;
}

export interface AppMenuMappedProps extends AppMenuProps {
  todo: StoreState["todo"];
}

interface MenuParams extends Params {
  type: string;
}

function mapStateToProps(state: StoreState, props: AppMenuProps): AppMenuMappedProps {
  return {
    todo: state.todo,
    history: props.history,
    location: props.location,
    params: path.params(props.location.pathname, "/todo/:type") as MenuParams,
  };
}

function AppMenuGroup(props: AppMenuMappedProps) {
  const { todo } = props;
  return (<div className="app_menu_items">
    <Titlebar
      left={<h6>Category</h6>}
      right={
        <Control>
          <Button type="primary" onClick={() => dispatch("MODAL_OPEN", {
            name: "ADD_CATEGORY",
          })}>Add</Button>
        </Control>
      }
    />
    <div className="main-menu-list">
      {todo.categories.map((a) => (
        <MenuItem
          key={a.id}
          title={a.name}
          onClick={() => {
            const pathname = props.location.pathname;
            const params = path.params(pathname, routes.pathname);

            const url = path.reduce(routes.pathname, {
              type: params.type,
              categoryID: a.id,
            });

            props.history.push(url);
          }}
          control={
            <Button
              icon="close"
              onClick={() => dispatch("TODO_DELETE_CATEGORY", {
                id: a.id
              })}
            />
          }
        />
      ))}
    </div>
  </div>);
}

export class AppMenuView extends React.Component<AppMenuMappedProps, {}> {
  render() {
    return (
      <div className="app_menu">
        <AppMenuCategories
          params={this.props.params}
          location={this.props.location}
          history={this.props.history}/>
        <AppMenuGroup {...this.props}/>
      </div>
    );
  }
}

export default withStore(AppMenuView, mapStateToProps)(withRouter);