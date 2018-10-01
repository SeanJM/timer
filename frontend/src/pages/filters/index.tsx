import React, { Component } from "react";
import { withStore } from "@frontend/store";
import { StoreState } from "@frontend/store";
import { FilterEditorConnect } from "./filter-editor";
import { FilterListConnect } from "./filter-list";
import { WithRouterProps } from "@frontend/components/router";
import { PanelGroup, Panel } from "@frontend/components/panel-group";
import { dispatch } from "@frontend/action";
import { path, PathParams } from "@path";

type FilterPathParams = PathParams<{
  categoryID: string;
  filterID: string;
}>;

interface FilterOutProps extends WithRouterProps {
  params: FilterPathParams;
  filterEditorDefaultWidth: number;
}

function mapStateToProps(state: StoreState, props: WithRouterProps): FilterOutProps {
  const params = path.params(props.location.pathname, state.routes.schema);
  return {
    ...props,
    params: {
      categoryID: params.categoryID,
      filterID: params.elementID,
    },
    filterEditorDefaultWidth: state.layout.filterEditorDefaultWidth,
  };
}

export class Filter extends Component<FilterOutProps, {}> {
  render() {
    const { filterID } = this.props.params;
    return (
      <PanelGroup>
        <Panel>
          <FilterListConnect {...this.props}/>
        </Panel>
        { filterID
          ? (
            <Panel
              defaultWidth={this.props.filterEditorDefaultWidth}
              onWidthChanged={(e) => {
                dispatch("LAYOUT", {
                  type: "SET_WIDTH",
                  value: {
                    target: "filterEditorDefaultWidth",
                    defaultWidth: e.width,
                  }
                });
              }}
            >
              <FilterEditorConnect {...this.props}/>
            </Panel>
          )
          : null}
      </PanelGroup>
    );
  }
}

export const FilterConnect = withStore(Filter, mapStateToProps)();