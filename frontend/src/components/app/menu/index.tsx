import * as React from "react";
import { withStore, StoreState } from "@store";
import Button from "@components/button";
import Control from "@components/control";
import Titlebar from "@components/titlebar";
import Icon, { IconType } from "@components/icon";
import { MenuItem } from "@components/menu";
import { dispatch } from "@action";
import {
  History,
  RouterLocation,
  withRouter,
} from "@components/router";
import path, { Params } from "@path";
import { routes } from "@components/app";

interface Props {
  todo: StoreState["todo"];
  history: History;
  location: RouterLocation;
  params: MenuParams;
}

interface ItemProps {
  onClick: () => void;
  isSelected: boolean;
  icon: IconType;
}

interface MenuParams extends Params {
  type: string;
}

function mapStateToProps(state: StoreState, props: Props): Props {
  return {
    todo: state.todo,
    history: props.history,
    location: props.location,
    params: path.params(props.location.pathname, "/todo/:type") as MenuParams,
  };
}

function AppMenuCategoriesItem(props: ItemProps) {
  const className = [
    "app_menu_categories_item"
  ];

  if (props.isSelected) {
    className.push("app_menu_categories_item-select");
  }

  return (
    <div
      onClick={props.onClick}
      className={className.join(" ")}
    >
      <Icon type={props.icon}/>
    </div>
  );
}

function AppMenuCategories(props: Pick<Props, "params" | "history" | "location">) {
  const location = props.location;
  const params = path.params(location.pathname, routes.root);
  const history = props.history;
  return (
    <div className="app_menu_categories">
      <AppMenuCategoriesItem
        onClick={() => {
          const withCategory =
            path.params(location.pathname, routes.category);
          let url;
          if (withCategory.__match) {
            url = path.replace(routes.params.todoCategory, {
              categoryID: withCategory.categoryID,
            });
          } else {
            url = routes.todoRoot;
          }
          history.push(url);
        }}
        isSelected={params.type === "todo"}
        icon="book"/>
      <AppMenuCategoriesItem
        onClick={() => {
          const withCategory =
            path.params(location.pathname, routes.category);
          let url;
          if (withCategory.__match) {
            url = path.replace(routes.params.tagsCategory, {
              categoryID: withCategory.categoryID,
            });
          } else {
            url = routes.todoRoot;
          }
          history.push(url);
        }}
        isSelected={params.type === "tags"}
        icon="tag"/>
    </div>
  );
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
            const params = path.params(pathname, routes.category);

            const url = path.replace(routes.category, {
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

export class AppMenuView extends React.Component<Props, {}> {
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