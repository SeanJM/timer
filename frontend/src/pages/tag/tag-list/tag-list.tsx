import * as pathlist from "@frontend/routes";
import generateHash from "@generate-hash";
import path, { PathParams } from "@path";
import React, { Component } from "react";
import { ColorPicker } from "@types";
import { dispatch } from "@frontend/action";
import { emptyForm } from "@frontend/action/form";
import { InputText } from "@frontend/components/input";
import { List, ListItem } from "@frontend/components/list";
import { SmartScroll } from "@frontend/components/smart-scroll";
import { Swatch } from "@frontend/components/swatch";
import { TagResponse, CategoryResponse } from "@types";
import { Timestamp } from "@frontend/components/timestamp";
import { TitleAndInput, TitleAndInputPassedProps } from "@frontend/components/title-and-input";
import { Titlebar } from "@frontend/components/titlebar";
import { Viewport } from "@frontend/components/viewport";
import { WithRouterProps } from "@frontend/components/router";
import { withStore, StoreState, StoreFormInput } from "@frontend/store";

const FORM_ID = generateHash();
const COLOR_PICKER_ID = "tag_name";

interface TagParams {
  categoryID?: string;
  todoID?: string;
}

interface Props extends
  Partial<TagResponse>,
  Pick<WithRouterProps, "history">,
  Pick<StoreState, "routes"> {
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
  const colorInput = state.color.colorPickers.find((a) => a.id === COLOR_PICKER_ID);

  return {
    routes: state.routes,
    params,
    history: props.history,
    colorPicker: state.color.colorPickers[COLOR_PICKER_ID] || {},
    categoryName: category && category.name,
    name: tagNameInput ? tagNameInput.value : "",
    color: colorInput ? colorInput.value : null,
    tags: tagCategory.tags.slice().sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1),
  };
}

class TagListView extends Component<Props, {}> {
  node: HTMLInputElement;
  selected: string[];

  constructor(props) {
    super(props);
    this.selected = [];
  }

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

  onSelect = (e: List.SelectEvent) => {
    this.selected = e.selected;
  }

  shortcutDidDelete = () => {
    dispatch("ALERT", {
      type: "PUSH",
      value: {
        type: "TAG_DELETE",
        categoryID: this.props.params.categoryID,
        idList: this.selected,
      }
    });
  }

  render() {
    const { params, history, routes } = this.props;
    return (
      <Viewport
        titlebar={
          <Titlebar>
            <TitleAndInput
              title="Tags"
              component={(props: TitleAndInputPassedProps) =>
                <InputTagName { ...props } color={this.props.color}/>}
              onSubmit={(name) => dispatch("TAG", {
                type: "CREATE",
                value: {
                  name,
                  color: this.props.color,
                  categoryID: params.categoryID,
                }
              } as Partial<Props>)}
            />
          </Titlebar>
        }
        body={
          <SmartScroll>
            <List
              multiselect
              onSelect={this.onSelect}
              shortcuts={{
                "DELETE": this.shortcutDidDelete,
              }}
            >
              {this.props.tags.map((tag) => {
                return (
                  <ListItem
                    id={tag.id}
                    title={tag.name}
                    onClick={() => {
                      history.push({
                        pathname: path.reduce(routes.schema, {
                          type: "tags",
                          categoryID: params.categoryID,
                          elementID: tag.id,
                        })
                      });
                    }}
                    primaryAction={
                      <Swatch
                        background={tag.color}
                      />
                    }
                    timestamp={<Timestamp>{tag.created}</Timestamp>}
                    key={tag.id}>
                  </ListItem>
                );
              })}
            </List>
          </SmartScroll>
        }
      />
    );
  }
}

export const TagListConnect =
  withStore(TagListView, mapStateToProps)() as React.ComponentClass<any>;