import React, { Component } from "react";
import { InputText } from "@frontend/components/input";
import { RouterProps } from "@frontend/components/router";
import Swatch from "@frontend/components/swatch";
import generateHash from "@generate-hash";
import { Viewport } from "@frontend/components/viewport";
import { withStore, StoreState } from "@frontend/store";
import { TagResponse, TagCategory, StoreFormInput } from "@types";
import { ColorPicker } from "@types";
import path from "@path";
import { dispatch } from "@frontend/action";
import * as pathlist from "@frontend/routes";
import { List, ListItem } from "@frontend/components/list";
import Timestamp from "@frontend/components/timestamp";
import { emptyForm } from "@frontend/action/form";
import { TitleAndInput, TitleAndInputPassedProps } from "@frontend/components/title-and-input";

const FORM_ID = generateHash();
const COLOR_PICKER_ID = "tag_name";

interface Props extends Partial<TagResponse> {
  categoryName: string;
  categoryID: string;
  colorPicker: Partial<ColorPicker>;
  tags: TagResponse[];
}

interface InputTagNameProps extends TitleAndInputPassedProps {
  color: string;
}

function InputTagName(props: InputTagNameProps) {
  return (
    <div className="todo-tags-input">
      <Swatch
        background={props.color}
        onClick={() => dispatch("COLOR_PICKER", {
          type: "OPEN",
          id: COLOR_PICKER_ID,
        })}
      />
      <InputText
        className="todo-tags_tag-input"
        onKeyDown={props.onKeyDown}
        autofocus={props.autofocus}
      />
    </div>
  );
}

function mapStateToProps(state: StoreState, props: RouterProps): Props {
  const params = path.params(props.location.pathname, pathlist.pathname);
  const category = state.todo.categories.find(a => a.id === params.categoryID);
  const form = state.form[FORM_ID] || emptyForm(FORM_ID);

  const tagCategory: TagCategory =
    state.tags.categories.find(a => a.id === params.categoryID) ||
    { id: params.categoryID, tags: [] };

  const tagNameInput: StoreFormInput = form.input.tagName;
  const colorInput: StoreFormInput = form.input.color;

  return {
    colorPicker: state.color.colorPickers.find((a) => a.id === COLOR_PICKER_ID) || {},
    categoryName: category && category.name,
    categoryID: params.categoryID,
    name: tagNameInput ? tagNameInput.value : "",
    color: colorInput ? colorInput.value : null,
    tags: tagCategory.tags,
  };
}

class TodoTags extends Component<Props, {}> {
  node: HTMLInputElement;

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.colorPicker.isOpen && !nextProps.colorPicker.isOpen && nextProps.colorPicker.value) {
      dispatch("FORM_VALUE", {
        id: FORM_ID,
        name: "color",
        type: "color",
        value: nextProps.colorPicker.value,
      });
    }
  }

  render() {
    return (
      <div className="todo-tags">
        <Viewport
          titlebar={
            <TitleAndInput
              title="Tags"
              component={
                (props: TitleAndInputPassedProps) =>
                  InputTagName({ ...props, color: this.props.color })
              }
              onValue={(name) => dispatch("CREATE_TAG", {
                name,
                color: this.props.color,
                categoryID: this.props.categoryID,
              } as Partial<Props>)}
            />
          }
          body={
            <List>
              {this.props.tags.map((tag) => {
                return (
                  <ListItem
                    title={tag.name}
                    primaryAction={
                      <Swatch
                        background={tag.color}
                        onClick={() => {
                          // console.log(color);
                        }}
                      />
                    }
                    timestamp={<Timestamp>{tag.created}</Timestamp>}
                    key={tag.id}>
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

export default withStore(TodoTags, mapStateToProps)() as React.ComponentClass<any>;