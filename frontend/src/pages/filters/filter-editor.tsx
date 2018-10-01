import React, { Component } from "react";
import { InputChipSelect } from "@frontend/components/input";
import { WithRouterProps } from "@frontend/components/router";
import generateHash from "@generate-hash";
import { Viewport } from "@frontend/components/viewport";
import { withStore, StoreState } from "@frontend/store";
import { TagResponse } from "@types";
import { PathParams } from "@path";
import { FormConnect, InputGroup } from "@frontend/components";
import { ChipData } from "@frontend/components/chip";
import { emptyForm } from "@frontend/action/form";
import { dispatch } from "@frontend/action";

const FORM_ID = generateHash();

interface FilterEditorInProps extends WithRouterProps {
  params: PathParams<{
    type: "filters";
    categoryID: string;
    filterID: string;
  }>;
}

interface FilterEditorOutProps {
  filterTags: string[];
  filterID: string;
  categoryID: string;
  categoryTags: TagResponse[];
  form: {
    tags: string[]
  };
}

function mapStateToProps(state: StoreState, props: FilterEditorInProps): FilterEditorOutProps {
  const categoryID = props.params.categoryID;
  const filterID = props.params.filterID;
  const category = state.todo.categories.find((a) => a.id === categoryID);
  const filter = category.filters.find((a) => a.id === filterID);
  const form = state.form[FORM_ID] || emptyForm(FORM_ID, ["filterTags"]);
  return {
    categoryID,
    filterID,
    form: {
      tags: form.input.filterTags.value || [],
    },
    categoryTags: category.tags,
    filterTags: filter.tags,
  };
}

export class FilterEditorView extends Component<FilterEditorOutProps> {
  tagsDidChange() {
    dispatch("FILTERS", {
      type: "EDIT",
      value: {
        categoryID: this.props.categoryID,
        filterID: this.props.filterID,
        tags: this.props.form.tags,
      }
    });
  }

  componentDidUpdate(prevProps: FilterEditorOutProps) {
    const isFilterID = this.props.filterID === prevProps.filterID;
    const tagsDidChange = this.props.form.tags.length !== prevProps.form.tags.length;
    if (isFilterID && tagsDidChange) {
      this.tagsDidChange();
    }
  }

  render() {
    const { categoryTags, filterTags } = this.props;
    return (
      <Viewport
        body={
          <FormConnect type="borderless" id={FORM_ID}>
            <InputGroup name="filterTags">
              <label>Tags</label>
              <InputChipSelect
                defaultValue={filterTags}
                data={categoryTags.map((tag) => {
                  return {
                    id: tag.id,
                    label: tag.name,
                    color: tag.color,
                  } as ChipData;
                })}
              />
            </InputGroup>
          </FormConnect>
        }
      />
    );
  }
}

export const FilterEditorConnect = withStore(FilterEditorView, mapStateToProps)();