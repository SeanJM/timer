import * as React from "react";
import { withStore, StoreState } from "@store";
import Button from "@components/button";
import Control from "@components/control";
import Titlebar from "@components/titlebar";
import Icon, { IconType } from "@components/icon";
import { MenuItem } from "@components/menu";
import { dispatch } from "@action";
import { 
  getParams, 
  History, 
  Link,
  Params, 
  RouterLocation, 
  withRouter,
} from "@components/router";
import path from "@path";

interface Props {
  todo: StoreState["todo"];
  history: History;
  location: RouterLocation;
  params: Params;
}

interface ItemProps {
  isSelected: boolean;
  to: string;
  icon: IconType;
}

function mapStateToProps(state: StoreState, props: Props): Props {
  return {
    todo: state.todo,
    history: props.history,
    location: props.location,
    params: getParams(props.location.pathname, "/todo/:category"),
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
    <Link 
      to={props.to} 
      className={className.join(" ")}
    >
      <Icon type={props.icon}/>
    </Link>
  );
}

function AppMenuCategories(props: Pick<Props, "params">) {
  const category = props.params.category;
  return (
    <div className="app_menu_categories">
      <AppMenuCategoriesItem 
        to="/todo/category" 
        isSelected={category === "category"} 
        icon="book"/>
      <AppMenuCategoriesItem 
        to="/todo/tags" 
        isSelected={category === "tags"} 
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
            const category = getParams(pathname, "/todo/:type/:typeID");
            
            const url = category.__match 
             ? path.splice(pathname, a.attributes.id, -1) 
             : path.push(pathname, a.attributes.id);
             
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
        <AppMenuCategories params={this.props.params}/>
        <AppMenuGroup {...this.props}/>
      </div>
    );
  }
}

export default withStore(AppMenuView, mapStateToProps)(withRouter);