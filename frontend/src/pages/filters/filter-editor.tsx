import React, { Component } from "react";

import { Button } from "@components/button";
import { ChipData } from "@components/chip";
import { dispatch } from "@frontend/action";
import { FormConnect, FormValue } from "@components/form";
import { InputChipSelect } from "@components/input";
import { InputGroup } from "@components/input-group";
import { InputText } from "@components/input";
import { PathParams } from "@path";
import { FilterTagTypes, FilterResponse } from "@types";
import { TitleAndInput } from "@components/title-and-input";
import { Titlebar } from "@components/titlebar";
import { Viewport } from "@components/viewport";
import { WithRouterProps } from "@components/router";
import { withStore, StoreState } from "@frontend/store";

import { path } from "@path";

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

interface FilterEditorInProps extends WithRouterProps {
  params: PathParams<{
    type: "filters";
    categoryID: string;
    filterID: string;
  }>;
}

interface FilterEditorOutProps extends Pick<WithRouterProps, "history"> {
  tagFilters: {
    [key in FilterTagTypes]: string[];
  };
  filterID: string;
  categoryID: string;
  filterName: string;

  includesTags: ChipData[];
  excludesTags: ChipData[];
  containsAnyTags: ChipData[];
}

function mapStateToProps(state: StoreState, props: FilterEditorInProps): FilterEditorOutProps {
  const categoryID = props.params.categoryID;
  const filterID = props.params.filterID;
  const category = state.todo.categories.find((a) => a.id === categoryID);
  const filter = category.filters.find((a) => a.id === filterID) || EMPTY_FILTER;

  return {
    history: props.history,
    categoryID,
    filterID,
    filterName: filter.name,

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

export class FilterEditorView extends Component<FilterEditorOutProps> {
  form: FormValue<{
    filterName: string;
    includesTags: string[];
    excludesTags: string[];
    containsAnyTags: string[];
  }>;

  constructor(props) {
    super(props);
    this.form = {};
  }

  formDidChange(value) {
    this.form = value;
  }

  handleEvent(e) {
    switch (e.type) {
      case "formchange": {
        this.formDidChange(e.value);
      }
    }
  }

  tagsDidChange() {
    dispatch("FILTERS", {
      type: "EDIT",
      value: {
        categoryID: this.props.categoryID,
        filterID: this.props.filterID,
        tagFilters: {
          includes: this.form.includesTags,
          excludes: this.form.excludesTags,
          any: this.form.containsAnyTags,
        },
      }
    });
  }

  nameDidChange() {
    dispatch("FILTERS", {
      type: "EDIT",
      value: {
        categoryID: this.props.categoryID,
        filterID: this.props.filterID,
        name: this.form.filterName,
      }
    });
  }

  render() {
    const { tagFilters, history } = this.props;
    return (
      <Viewport
        titlebar={
          <Titlebar
            primaryAction={
              <Button
                onClick={() => {
                  history.push({
                    pathname: path(location.pathname).pop().value
                  });
                }}
                icon="close"
              />
            }
          >
            <FormConnect onChange={this}>
              <TitleAndInput
                icon="edit"
                name="filterName"
                defaultValue={this.props.filterName}
                title={this.form.filterName || this.props.filterName}
                component={InputText}
                onSubmit={() => this.nameDidChange()}
              />
            </FormConnect>
          </Titlebar>
        }
        body={
          <FormConnect type="borderless" onChange={this}>
            <InputGroup>
              <label>Includes tags</label>
              <InputChipSelect
                data={this.props.includesTags}
                defaultValue={tagFilters.includes}
                name="includesTags"
                onInput={() => this.tagsDidChange()}
              />
            </InputGroup>
            <InputGroup>
              <label>Excludes tags</label>
              <InputChipSelect
                data={this.props.excludesTags}
                defaultValue={tagFilters.excludes}
                name="excludesTags"
                onInput={() => this.tagsDidChange()}
              />
            </InputGroup>
            <InputGroup>
              <label>Contains any tag</label>
              <InputChipSelect
                data={this.props.containsAnyTags}
                defaultValue={tagFilters.any}
                name="containsAnyTags"
                onInput={() => this.tagsDidChange()}
              />
            </InputGroup>
          </FormConnect>
        }
      />
    );
  }
}

export const FilterEditorConnect = withStore(FilterEditorView, mapStateToProps)();