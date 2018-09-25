import React from "react";
import { ContextMenuView, ContextMenuItem } from "@frontend/components/context-menu";
// import { dispatch } from "@frontend/action";
import { StoreState, withStore } from "@frontend/store";
import path, { PathParams } from "@path";
import { withRouter } from "@frontend/components/router";
import { ContextMenuProps } from "@frontend/components/context-menu";
import { FilterResponse } from "types";

interface ContextMenuParams {
  type: string;
  categoryID: string;
  elementID: string;
}

interface ContextMenuFilterProps extends Partial<ContextMenuProps> {
  params: PathParams<ContextMenuParams>;
  filters: FilterResponse[];
}

function mapStateToProps(state: StoreState, props): ContextMenuFilterProps {
  const { pathname } = props.location;
  const { schema } = state.routes;
  const params = path.params<ContextMenuParams>(pathname, schema);
  const categoryElement = state.todo.categories.find((a) => a.id === params.categoryID);
  console.log(categoryElement);
  return {
    ...props,
    filters: categoryElement.filters,
    params,
  };
}

function ContextMenuFilterView(props: ContextMenuFilterProps) {
  return (
    <ContextMenuView {...props}>
      {props.filters.map((filterElement) => {
        return (
          <ContextMenuItem key={filterElement.id} type="select">
            {filterElement.name}
          </ContextMenuItem>
        );
      })}
    </ContextMenuView>
  );
}

export const ContextMenuFilterConnect =
  withStore<ContextMenuProps>(ContextMenuFilterView, mapStateToProps)(withRouter);