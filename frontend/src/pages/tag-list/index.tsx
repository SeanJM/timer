import React, { Component } from "react";
import { InputText } from "@frontend/components/input";
import { WithRouterProps } from "@frontend/components/router";
import Swatch from "@frontend/components/swatch";
import generateHash from "@generate-hash";
import { Viewport } from "@frontend/components/viewport";
import { withStore, StoreState } from "@frontend/store";
import { TagResponse, StoreFormInput, CategoryResponse } from "@types";
import { ColorPicker } from "@types";
import path, { PathParams } from "@path";
import { dispatch } from "@frontend/action";
import * as pathlist from "@frontend/routes";
import { List, ListItem } from "@frontend/components/list";
import { Timestamp } from "@frontend/components/timestamp";
import { emptyForm } from "@frontend/action/form";
import { TitleAndInput, TitleAndInputPassedProps } from "@frontend/components/title-and-input";
import { Titlebar } from "@frontend/components/titlebar";
import { Button } from "@frontend/components/button";
import { routes } from "@frontend/components/app";

const FORM_ID = generateHash();
const COLOR_PICKER_ID = "tag_name";

interface TagParams {
  categoryID?: string;
  todoID?: string;
}

interface Props extends Partial<TagResponse>, Pick<WithRouterProps, "history"> {
  params: PathParams<TagParams>;
  categoryName: string;
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
        onValue={props.onValue}
        onKeyDown={props.onKeyDown}
        autofocus={props.autofocus}
        defaultValue={props.defaultValue}
      />
    </div>
  );
}

function mapStateToProps(state: StoreState, props: WithRouterProps): Props {
  const params = path.params<TagParams>(props.location.pathname, pathlist.pathname);
  const category = state.todo.categories.find((a) => a.id === params.categoryID);
  const form = state.form[FORM_ID] || emptyForm(FORM_ID);

  const tagCategory: CategoryResponse =
    state.todo.categories.find((a) => a.id === params.categoryID);

  const tagNameInput: StoreFormInput = form.input.tagName;
  const colorInput: StoreFormInput = form.input.color;

  return {
    params,
    history: props.history,
    colorPicker: state.color.colorPickers.find((a) => a.id === COLOR_PICKER_ID) || {},
    categoryName: category && category.name,
    name: tagNameInput ? tagNameInput.value : "",
    color: colorInput ? colorInput.value : null,
    tags: tagCategory.tags.slice().sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1),
  };
}

class TagListView extends Component<Props, {}> {
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
    const { params, history } = this.props;
    const className = ["todo-tags"];

    if (params.categoryID) {
      className.push("todo-tags--category-id");
    }

    if (params.todoID) {
      className.push("todo-tags--todo-id");
    }

    return (
      <div className={className.join(" ")}>
        <Viewport
          titlebar={
            <Titlebar>
              <TitleAndInput
                title="Tags"
                component={
                  (props: TitleAndInputPassedProps) =>
                    InputTagName({ ...props, color: this.props.color })
                }
                onSubmit={(name) => dispatch("CREATE_TAG", {
                  name,
                  color: this.props.color,
                  categoryID: params.categoryID,
                } as Partial<Props>)}
              />
            </Titlebar>
          }
          body={
            <List>
              {this.props.tags.map((tag) => {
                return (
                  <ListItem
                    title={tag.name}
                    onClick={() => {
                      history.push({
                        pathname: path.reduce(routes.pathname, {
                          type: "tags",
                          categoryID: params.categoryID,
                          todoID: tag.id,
                        })
                      });
                    }}
                    primaryAction={
                      <Swatch
                        background={tag.color}
                      />
                    }
                    control={<Button icon="close" onClick={() => dispatch("TAG", {
                      type: "DELETE",
                      value: {
                        categoryID: params.categoryID,
                        tagID: tag.id,
                      }
                    })}/>}
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

export const TagList = withStore(TagListView, mapStateToProps)() as React.ComponentClass<any>;