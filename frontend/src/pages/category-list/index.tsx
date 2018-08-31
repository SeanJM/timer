import React, { Component } from "react";
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

export class CategoryList extends Component<AppMenuMappedProps, {}> {
  render() {
    const { todo } = this.props;
    return (
      <div className="category-list">
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
                const pathname = this.props.location.pathname;
                const params = path.params(pathname, routes.pathname);

                const url = path.reduce(routes.pathname, {
                  type: params.type,
                  categoryID: a.id,
                });

                this.props.history.push(url);
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
      </div>
    );
  }
}

export const CategoryListConnect =
  withStore<AppMenuProps>(CategoryList, mapStateToProps)(withRouter);