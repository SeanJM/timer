import React, { Component } from "react";
import { InputText } from "@frontend/components/input";
import { WithRouterProps } from "@frontend/components/router";
import { Viewport } from "@frontend/components/viewport";
import { withStore, StoreState } from "@frontend/store";
import { TagResponse, FilterResponse } from "@types";
import path, { PathParams } from "@path";
import { dispatch } from "@frontend/action";
import { List, ListItem } from "@frontend/components/list";
import { Timestamp } from "@frontend/components/timestamp";
import { TitleAndInput } from "@frontend/components/title-and-input";
import { Titlebar } from "@frontend/components/titlebar";
import { Button } from "@frontend/components/button";
import sortBy from "@sort-by";

interface FilterInParams {
  categoryID: string;
}

interface FilterOutParams {
  categoryID: string;
  elementID?: string;
}

interface FilterListInProps extends WithRouterProps {
  params: PathParams<FilterInParams>;
}

interface FilterOutProps extends
  Partial<TagResponse>,
  Pick<FilterListInProps, | "history">,
  Pick<StoreState, "routes"> {
  params: PathParams<FilterOutParams>;
  categoryName: string;
  filters: FilterResponse[];
}

const sortByName = sortBy((x) => x["name"].toLowerCase());

function mapStateToProps(state: StoreState, props: FilterListInProps): FilterOutProps {
  const { history, location } = props;

  const params =
    path.params<FilterOutParams>(location.pathname, state.routes.schema);

  const category =
    state.todo.categories.find((a) => a.id === params.categoryID);

  const filters =
    category.filters.slice().sort(sortByName);

  return {
    categoryName: category && category.name,
    filters,
    history,
    params,
    routes: state.routes,
  };
}

class FilterListView extends Component<FilterOutProps, {}> {
  node: HTMLInputElement;

  render() {
    const { params, history, routes, filters } = this.props;
    const className = ["filters"];

    if (params.categoryID) {
      className.push("filters--category-id");
    }

    if (params.elementID) {
      className.push("filters--filter-id");
    }

    return (
      <div className={className.join(" ")}>
        <Viewport
          titlebar={
            <Titlebar>
              <TitleAndInput
                title="Filters"
                component={InputText}
                onSubmit={(name) => dispatch("FILTERS", {
                  type: "CREATE",
                  value: {
                    name,
                    categoryID: params.categoryID,
                  }
                })}
              />
            </Titlebar>
          }
          body={
            <List>
              {filters.map((filter) => {
                return (
                  <ListItem
                    key={filter.id}
                    title={filter.name}
                    timestamp={
                      <Timestamp>{filter.created}</Timestamp>
                    }
                    onClick={() => {
                      history.push({
                        pathname: path.reduce(routes.schema, {
                          type: "filters",
                          categoryID: params.categoryID,
                          elementID: filter.id,
                        })
                      });
                    }}
                    secondaryAction={
                      <Button
                        icon="close"
                        onClick={() => dispatch("FILTERS", {
                          type: "DELETE",
                          value: {
                            categoryID: params.categoryID,
                            tagID: filter.id,
                          }
                        })}
                      />
                    }
                    >
                  </ListItem>
                );
              })}
            </List>
          }
        />
      </div>
    );
  }
}

export const FilterList = withStore(FilterListView, mapStateToProps)() as React.ComponentClass<any>;