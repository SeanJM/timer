import React from "react";
import { ContextMenuView, ContextMenuItem } from "@frontend/components/context-menu";
import { dispatch } from "@frontend/action";
import { StoreState, withStore } from "@frontend/store";
import path, { PathParams } from "@path";
import { withRouter } from "@frontend/components/router";
import { ContextMenuProps } from "@frontend/components/context-menu";
import { CategorySortBy } from "types";

interface ContextMenuParams {
  type: string;
  categoryID: string;
  elementID: string;
}

interface ContextMenuSortProps extends Partial<ContextMenuProps> {
  params: PathParams<ContextMenuParams>;
  sortBy: CategorySortBy;
}

function mapStateToProps(state: StoreState, props): ContextMenuSortProps {
  const { pathname } = props.location;
  const { schema } = state.routes;
  const params = path.params<ContextMenuParams>(pathname, schema);
  const categoryElement = state.todo.categories.find((a) => a.id === params.categoryID);
  return {
    ...props,
    sortBy: categoryElement.sortBy,
    params,
  };
}

function ContextMenuSortView(props: ContextMenuSortProps) {
  return (
    <ContextMenuView {...props}>
      <ContextMenuItem
        type="select"
        check={props.sortBy === "date"} onClick={() => dispatch("CATEGORY", {
        type: "SORT_BY",
        value: {
          sortBy: "date",
          categoryID: props.params.categoryID,
        }
      })}>Sort by date</ContextMenuItem>

      <ContextMenuItem
        type="select"
        check={props.sortBy === "priority"} onClick={() => dispatch("CATEGORY", {
        type: "SORT_BY",
        value: {
          sortBy: "priority",
          categoryID: props.params.categoryID,
        }
      })}>Sort by priority</ContextMenuItem>

      <ContextMenuItem
        type="select"
        check={props.sortBy === "name"} onClick={() => dispatch("CATEGORY", {
        type: "SORT_BY",
        value: {
          sortBy: "name",
          categoryID: props.params.categoryID,
        }
      })}>Sort by name</ContextMenuItem>
    </ContextMenuView>
  );
}

export const ContextMenuSort = withStore<ContextMenuProps>(ContextMenuSortView, mapStateToProps)(withRouter);