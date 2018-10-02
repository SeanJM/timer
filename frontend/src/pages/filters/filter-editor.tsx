import React, { Component } from "react";
import generateHash from "@generate-hash";

import { Button } from "@components/button";
import { ChipData } from "@components/chip";
import { dispatch } from "@frontend/action";
import { FormConnect } from "@components/form";
import { InputChipSelect } from "@components/input";
import { InputGroup } from "@components/input-group";
import { InputText } from "@components/input";
import { PathParams } from "@path";
import { TagResponse, FilterTagTypes } from "@types";
import { TitleAndInput } from "@components/title-and-input";
import { Titlebar } from "@components/titlebar";
import { Viewport } from "@components/viewport";
import { WithRouterProps } from "@components/router";
import { withStore, StoreState } from "@frontend/store";

import { path } from "@path";

const FORM_ID = generateHash();

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
  categoryTags: TagResponse[];
  filterName: string;
  form: {
    tagFilters: { [key in FilterTagTypes]: string[] };
    filterName: string;
  };
}

function mapStateToProps(state: StoreState, props: FilterEditorInProps): FilterEditorOutProps {
  const categoryID = props.params.categoryID;
  const filterID = props.params.filterID;
  const category = state.todo.categories.find((a) => a.id === categoryID);
  const filter = category.filters.find((a) => a.id === filterID);
  const form = state.form[FORM_ID];

  return {
    history: props.history,
    categoryID,
    filterID,
    filterName: filter.name,
    form: {
      tagFilters: {
        includes: form ? (form.input.includesTags || { value: [] }).value : [],
        excludes: form ? (form.input.excludesTags || { value: [] }).value : [],
        any: form ? (form.input.containsAnyTag || { value: [] }).value : [],
      },
      filterName: form ? (form.input.filterName || { value: "" }).value : "",
    },
    tagFilters: filter.tagFilters,
    categoryTags: category.tags,
  };
}

export class FilterEditorView extends Component<FilterEditorOutProps> {
  tagsDidChange() {
    dispatch("FILTERS", {
      type: "EDIT",
      value: {
        categoryID: this.props.categoryID,
        filterID: this.props.filterID,
        tagFilters: this.props.form.tagFilters,
      }
    });
  }

  nameDidChange() {
    dispatch("FILTERS", {
      type: "EDIT",
      value: {
        categoryID: this.props.categoryID,
        filterID: this.props.filterID,
        name: this.props.form.filterName,
      }
    });
  }

  componentDidUpdate(prevProps: FilterEditorOutProps) {
    const isFilterID = this.props.filterID === prevProps.filterID;

    const nextTags = this.props.form.tagFilters;
    const prevTags = prevProps.form.tagFilters;
    const tagsDidChange =
      nextTags.includes.length !== prevTags.includes.length ||
      nextTags.excludes.length !== prevTags.excludes.length ||
      nextTags.any.length !== prevTags.any.length;

    if (isFilterID && tagsDidChange) {
      this.tagsDidChange();
    }
  }

  render() {
    const { categoryTags, tagFilters, history } = this.props;
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
            <TitleAndInput
              icon="edit"
              name="filterName"
              defaultValue={this.props.filterName}
              title={this.props.form.filterName || this.props.filterName}
              component={InputText}
              onSubmit={() => this.nameDidChange()}
              onValue={(e) => {
                dispatch("FORM_VALUE", {
                  id: FORM_ID,
                  ...e,
                });
            }}
            />
          </Titlebar>
        }
        body={
          <FormConnect type="borderless" id={FORM_ID}>
            <InputGroup>
              <label>Includes tags</label>
              <InputChipSelect
                name="includesTags"
                defaultValue={tagFilters.includes}
                data={categoryTags
                  .filter((tag) => {
                    return (
                      tagFilters.excludes.indexOf(tag.id) === -1 &&
                      tagFilters.any.indexOf(tag.id) === -1
                    );
                  })
                  .map((tag) => {
                    return {
                      id: tag.id,
                      label: tag.name,
                      color: tag.color,
                    } as ChipData;
                  })
                }
              />
            </InputGroup>
            <InputGroup>
              <label>Excludes tags</label>
              <InputChipSelect
                name="excludesTags"
                defaultValue={tagFilters.excludes}
                data={categoryTags
                  .filter((tag) => {
                    return (
                      tagFilters.includes.indexOf(tag.id) === -1 &&
                      tagFilters.any.indexOf(tag.id) === -1
                    );
                  })
                  .map((tag) => {
                    return {
                      id: tag.id,
                      label: tag.name,
                      color: tag.color,
                    } as ChipData;
                  })
                }
              />
            </InputGroup>
            <InputGroup>
              <label>Contains any tag</label>
              <InputChipSelect
                name="containsAnyTag"
                defaultValue={tagFilters.any}
                data={categoryTags
                  .filter((tag) => {
                    return (
                      tagFilters.includes.indexOf(tag.id) === -1 &&
                      tagFilters.excludes.indexOf(tag.id) === -1
                    );
                  })
                  .map((tag) => {
                    return {
                      id: tag.id,
                      label: tag.name,
                      color: tag.color,
                    } as ChipData;
                  })
                }
              />
            </InputGroup>
          </FormConnect>
        }
      />
    );
  }
}

export const FilterEditorConnect = withStore(FilterEditorView, mapStateToProps)();