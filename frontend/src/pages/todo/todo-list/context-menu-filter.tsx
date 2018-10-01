import React from "react";
import { ContextMenuView, ContextMenuItem } from "@frontend/components/context-menu";
// import { dispatch } from "@frontend/action";
import { StoreState, withStore } from "@frontend/store";
import path, { PathParams } from "@path";
import { withRouter } from "@frontend/components/router";
import { ContextMenuProps } from "@frontend/components/context-menu";
import { FilterResponse, CategoryFilterBy } from "@types";
import { dispatch } from "@frontend/action";

interface ContextMenuParams {
  type: string;
  categoryID: string;
  elementID: string;
}

interface ContextMenuFilterProps extends Partial<ContextMenuProps> {
  params: PathParams<ContextMenuParams>;
  categoryID: string;
  filters: FilterResponse[];
  filterBy: CategoryFilterBy;
}

function mapStateToProps(state: StoreState, props): ContextMenuFilterProps {
  const { pathname } = props.location;
  const { schema } = state.routes;
  const params = path.params<ContextMenuParams>(pathname, schema);
  const categoryElement = state.todo.categories.find((a) => a.id === params.categoryID);
  return {
    ...props,
    filters: categoryElement.filters,
    filterBy: categoryElement.filterBy,
    categoryID: params.categoryID,
  };
}

function ContextMenuFilterView(props: ContextMenuFilterProps) {
  return (
    <ContextMenuView {...props}>
      {props.filters.map((filterElement) => {
        return (
          <ContextMenuItem
            key={filterElement.id}
            check={props.filterBy === filterElement.id}
            type="select"
            onClick={() => dispatch("CATEGORY", {
              type: "FILTER_BY",
              value: {
                categoryID: props.categoryID,
                filterBy: filterElement.id
              }
            })}
          >
            {filterElement.name}
          </ContextMenuItem>
        );
      })}
      <hr/>
      <ContextMenuItem
        type="select"
        onClick={() => dispatch("CATEGORY", {
          type: "FILTER_BY",
          value: {
            categoryID: props.categoryID,
            filterBy: null
          }
        })}
      >
        Clear
      </ContextMenuItem>
    </ContextMenuView>
  );
}

export const ContextMenuFilterConnect =
  withStore<ContextMenuProps>(ContextMenuFilterView, mapStateToProps)(withRouter);