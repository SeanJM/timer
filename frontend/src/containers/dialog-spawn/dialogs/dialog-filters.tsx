import generateId from "@generate-id";
import React from "react";
import { dispatch } from "@action";
import { FilterResponse, FilterTagTypes } from "@types";
import { InputValueEvent } from "@types";
import { PathQueryValue } from "@path";
import { StoreState, withStore } from "@store";
import { withRouter, WithRouterProps } from "@router";

import { Button } from "@components/button";
import { ChipData } from "@components/chip";
import { Control } from "@components/control";
import { Dialog } from "@components/dialog";
import { Form } from "@components/form";
import { InputChipSelect } from "@components/input";
import { InputGroup } from "@components/input-group";
import { ListScroll, ListItem, List, ListItemEdit } from "@components/list";
import { SplitView } from "@components/split-view";

const NO_FILTER = generateId();
const NO_FILTER_HR = generateId();

const EMPTY_FILTER: FilterResponse = {
  name: null,
  id: null,
  created: null,
  tagFilters: {
    excludes: [],
    any: [],
    includes: [],
  }
};

function mapStateToProps(state: StoreState, props: DialogFilters.IncomingProps): DialogFilters.MappedProps {
  const category = state.todo.categories.find((a) => a.id === props.categoryID);
  const filters = category.filters.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
  const filterBy = props.query.filterBy;
  const filter = category.filters.find((a) => a.id === filterBy) || EMPTY_FILTER;

  return {
    ...props,
    filterID: props.query.filterBy,
    filters,
    includesTags:
      category.tags
        .filter((tag) => {
          return (
            filter.tagFilters.excludes.indexOf(tag.id) === -1 &&
            filter.tagFilters.any.indexOf(tag.id) === -1
          );
        })
        .map((tag) => {
          return {
            id: tag.id,
            label: tag.name,
            color: tag.color,
          } as ChipData;
        }),

    excludesTags:
      category.tags
        .filter((tag) => {
          return (
            filter.tagFilters.includes.indexOf(tag.id) === -1 &&
            filter.tagFilters.any.indexOf(tag.id) === -1
          );
        })
        .map((tag) => {
          return {
            id: tag.id,
            label: tag.name,
            color: tag.color,
          } as ChipData;
        }),

    containsAnyTags:
      category.tags
        .filter((tag) => {
          return (
            filter.tagFilters.includes.indexOf(tag.id) === -1 &&
            filter.tagFilters.excludes.indexOf(tag.id) === -1
          );
        })
        .map((tag) => {
          return {
            id: tag.id,
            label: tag.name,
            color: tag.color,
          } as ChipData;
        }),

    tagFilters: filter.tagFilters,
  };
}

class DialogFilters extends React.Component<DialogFilters.MappedProps> {
  value: Form.Value<{
    includesTags: string[];
    excludesTags: string[];
    containsAnyTags: string[];
  }>;

  dispatchSelect = (e: List.SelectEvent) => {
    const { history } = this.props;
    const filterBy = e.selected[0] === NO_FILTER ? null : e.selected[0];
    history.push({
      query: {
        ...this.props.query,
        filterBy,
      }
    });
  }

  dispatchlistItemSubmit = (e: InputValueEvent) => {
    const { categoryID, filterID } = this.props;

    dispatch("FILTERS", {
      type: "EDIT",
      value: {
        categoryID,
        filterID,
        name: e.value,
      }
    });
  }

  formDidChange = (e: Form.ChangeEvent) => {
    const { categoryID, filterID } = this.props;

    this.value = {
      ...this.value,
      ...e.value
    };

    dispatch("FILTERS", {
      type: "EDIT",
      value: {
        categoryID,
        filterID,
        tagFilters: {
          includes: this.value.includesTags || [],
          excludes: this.value.excludesTags || [],
          any: this.value.containsAnyTags || [],
        },
      }
    });
  }

  render() {
    const filterBy = this.props.query.filterBy || NO_FILTER;
    const { tagFilters, filters } = this.props;
    const listItems = [];

    let i = -1;
    const n = filters.length;

    while (++i < n) {
      listItems.push(
        <ListItemEdit
          id={filters[i].id}
          key={filters[i].id}
          name={filters[i].name}
          onSubmit={this.dispatchlistItemSubmit}
          title={filters[i].name}
        />
      );
    }

    listItems.push(
      <hr key={NO_FILTER_HR}/>,
      <ListItem
        id={NO_FILTER}
        key={NO_FILTER}
        title={"none"}
      />
    );

    return <Dialog
      title="Edit filters"
      id={this.props.id}
      body={
        <SplitView
          left={
            <ListScroll
              selectedIDList={[ filterBy ]}
              onSelect={this.dispatchSelect}
              footer={
                <Control>
                  <Button icon="add"/>
                </Control>
              }
            >
              {listItems}
            </ListScroll>
          }
          right={
            <Form type="borderless" onChange={this.formDidChange}>
              <InputGroup>
                <label>Includes tags</label>
                <InputChipSelect
                  data={this.props.includesTags}
                  defaultValue={tagFilters.includes}
                  name="includesTags"
                />
              </InputGroup>
              <InputGroup>
                <label>Excludes tags</label>
                <InputChipSelect
                  data={this.props.excludesTags}
                  defaultValue={tagFilters.excludes}
                  name="excludesTags"
                />
              </InputGroup>
              <InputGroup>
                <label>Contains any tag</label>
                <InputChipSelect
                  data={this.props.containsAnyTags}
                  defaultValue={tagFilters.any}
                  name="containsAnyTags"
                />
              </InputGroup>
            </Form>
          }
        />
      }
      footer={<div/>}
    />;
  }
}

namespace DialogFilters {
  export interface IncomingProps extends WithRouterProps {
    query: PathQueryValue<{ filterBy: string }>;
    id: string;
    categoryID: string;
  }

  export interface MappedProps extends IncomingProps {
    containsAnyTags: ChipData[];
    excludesTags: ChipData[];
    filterID: string;
    filters: StoreState["filters"]["elements"];
    includesTags: ChipData[];
    tagFilters: {
      [key in FilterTagTypes]: string[];
    };
  }
}

export { DialogFilters };

export const DialogFiltersConnected =
  withStore<DialogFilters.IncomingProps>(DialogFilters, mapStateToProps)(withRouter);