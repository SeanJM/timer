import * as React from "react";
import { withStore, StoreState } from "@store";
import { Button } from "@components";
import { dispatch } from "@action";

interface Props {
  categories: StoreState["categories"]
}

function mapStateToProps(state: StoreState, props) {
  return {
    categories: state.categories
  };
}

export class MenuView extends React.Component<Props, {}> {
  render() {
    return (
      <div className="menu">
        <div className="menu_titlebar">
          <div className="menu_titlebar_content">
            <h6>Category</h6>
            <Button type="primary" onClick={() => dispatch("MODAL_OPEN", {
              name: "ADD_CATEGORY",
            })}>Add</Button>
          </div>
        </div>
        <div className="main-menu-list">

        </div>
      </div>
    );
  }
}

export const MenuConnect = withStore(MenuView, mapStateToProps)();