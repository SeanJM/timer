import * as React from "react";
import { withStore, StoreState } from "@store";
import Button from "@components/button";
import Control from "@components/control";
import Titlebar from "@components/titlebar";
import { Menu, MenuItem } from "@components/menu";
import { dispatch } from "@action";
import { History, withRouter, RouterLocation } from "@components/router";
import URL from "@class/url";

interface Props {
  todo: StoreState["todo"];
  history: History;
  location: RouterLocation;
}

function mapStateToProps(state: StoreState, props: Props) {
  return {
    todo: state.todo,
    history: props.history,
    location: props.location,
  };
}

export class AppMenuView extends React.Component<Props, {}> {
  render() {
    const { todo } = this.props;
    return (
      <Menu>
        <Titlebar
          left={<h6>Category</h6>}
          right={
            <Control>
              <Button type="primary" onClick={() => dispatch("MODAL_OPEN", {
                name: "ADD_CATEGORY",
              })}>Add</Button>
            </Control>
          } />
        <div className="main-menu-list">
          {todo.categories.map((a) => (
            <MenuItem
              key={a.attributes.id}
              title={a.attributes.name}
              onClick={() => {
                const url = new URL(this.props.location);
                url.location.pathname = "/todo/category/" + a.attributes.id;
                this.props.history.push(url.toString());
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
      </Menu>
    );
  }
}

export default withStore(AppMenuView, mapStateToProps)(withRouter);