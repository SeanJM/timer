import * as React from "react";
import { withStore, StoreState } from "@store";
import Button from "@components/button";
import Control from "@components/control";
import Titlebar from "@components/titlebar";
import { MenuItem } from "@components/menu";
import { dispatch } from "@action";

import {
  History,
  RouterLocation,
  withRouter,
} from "@components/router";

import AppMenuCategories from "./app-menu-categories";
import path, { Params } from "@path";
import { routes } from "@components/app";

export interface AppMenuProps {
  todo: StoreState["todo"];
  history: History;
  location: RouterLocation;
  params: MenuParams;
}

interface MenuParams extends Params {
  type: string;
}

function mapStateToProps(state: StoreState, props: AppMenuProps): AppMenuProps {
  return {
    todo: state.todo,
    history: props.history,
    location: props.location,
    params: path.params(props.location.pathname, "/todo/:type") as MenuParams,
  };
}

function AppMenuGroup(props) {
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
          key={a.attributes.id}
          title={a.attributes.name}
          onClick={() => {
            const pathname = props.location.pathname;
            const params = path.params(pathname, routes.pathname);

            const url = path.replace(routes.pathname, {
              type: params.type,
              categoryID: a.attributes.id,
            });

            console.log(url);

            props.history.push(url);
          }}
          control={
            <Button
              icon="close"
              onClick={() => dispatch("TODO_DELETE_CATEGORY", {
                id: a.attributes.id
              })}
            />
          }
        />
      ))}
    </div>
  </div>);
}

export class AppMenuView extends React.Component<AppMenuProps, {}> {
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