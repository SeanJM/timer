import * as React from "react";
import path from "@path";
import { routes } from "@frontend/routes";
import Icon, { IconType } from "@frontend/components/icon";
import { History, RouterLocation } from "@frontend/components/router";
import { AppMenuProps } from "./";

interface AppMenuCategoriesItemProps {
  isSelected: boolean;
  icon: IconType;
  history: History;
  location: RouterLocation;
  type: "todo" | "tags"
}

function AppMenuCategoriesItem(props: AppMenuCategoriesItemProps) {
  const history = props.history;
  const location = props.location;

  const className = [
    "app_menu_categories_item"
  ];

  if (props.isSelected) {
    className.push("app_menu_categories_item-select");
  }

  return (
    <div
      onClick={() => {
        const params =
          path.params(location.pathname, routes.pathname);

        let url = path.reduce(routes.pathname, {
          type: props.type,
          categoryID: params.categoryID,
        });

        console.log(url, routes.pathname);

        history.push(url);
      }}
      className={className.join(" ")}
    >
      <Icon type={props.icon}/>
    </div>
  );
}

export default function AppMenuCategories(props: Pick<AppMenuProps, "params" | "history" | "location">) {
  const location = props.location;
  const params = path.params(location.pathname, routes.pathname);
  return (
    <div className="app_menu_categories">
      <AppMenuCategoriesItem
        history={props.history}
        location={props.location}
        type="todo"
        isSelected={params.type === "todo"}
        icon="book"/>
      <AppMenuCategoriesItem
        location={props.location}
        history={props.history}
        type="tags"
        isSelected={params.type === "tags"}
        icon="tag"/>
    </div>
  );
}