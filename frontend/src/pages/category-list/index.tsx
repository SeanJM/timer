import React, { Component } from "react";
import { withStore, StoreState } from "@frontend/store";
import { Button } from "@frontend/components/button";
import Titlebar from "@frontend/components/titlebar";
import { MenuItem } from "@frontend/components/menu";
import { dispatch } from "@frontend/action/";

import {
  RouterHistory,
  RouterLocation,
  withRouter,
} from "@frontend/components/router";

import path, { PathParams } from "@path";
import { routes } from "@frontend/routes";
import { TitleAndInput } from "@frontend/components/title-and-input";
import { InputText } from "@frontend/components";

export interface AppMenuProps {
  history: RouterHistory;
  location: RouterLocation;
  params: MenuParams;
  setCategoryName: boolean;
}

export interface AppMenuMappedProps extends AppMenuProps {
  todo: StoreState["todo"];
}

interface MenuParams extends PathParams {
  type: "todo" | "tags";
  categoryID: string;
}

function mapStateToProps(state: StoreState, props: AppMenuProps): AppMenuMappedProps {
  return {
    todo: state.todo,
    history: props.history,
    location: props.location,
    params: path.params<MenuParams>(props.location.pathname, "/:type/:categoryID"),
    setCategoryName: state.categories.setName,
  };
}

export class CategoryList extends Component<AppMenuMappedProps, {}> {
  render() {
    const { todo, params } = this.props;
    return (
      <div className="category-list">
        <Titlebar
          left={
            <TitleAndInput
              component={InputText}
              title="Category"
              onSubmit={value => dispatch("CATEGORY", {
                type: "CREATE",
                value,
              })}
            />
          }
        />
        <div className="main-menu-list">
          {todo.categories.map((a) => (
            <MenuItem
              key={a.id}
              title={a.name}
              isSelected={params.categoryID === a.id}
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
                  onClick={() => dispatch("CATEGORY", {
                    type: "DELETE",
                    value: {
                      id: a.id
                    }
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