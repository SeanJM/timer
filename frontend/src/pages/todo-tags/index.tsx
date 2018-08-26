import React, { Component } from "react";
import Button from "@frontend/components/button";
import { Input } from "@frontend/components/input";
import { FormConnect } from "@frontend/components/form";
import { RouterProps } from "@frontend/components/router";
import Titlebar from "@frontend/components/titlebar";
import Swatch from "@frontend/components/swatch";
import generateHash from "@generate-hash";
import { Viewport } from "@frontend/components/viewport";
import { withStore, StoreState, FormElementInput } from "@frontend/store";
import { TagNode } from "@types";
import { ColorPicker } from "@types";
import path from "@path";
import { dispatch } from "@frontend/action";
import * as pathlist from "@frontend/routes";
import { List, ListItem } from "@frontend/components/list";
import Timestamp from "@frontend/components/timestamp";

const FORM_ID = generateHash();
const COLOR_PICKER_ID = "tag_name";

interface Props extends Partial<TagNode>, Pick<StoreState, "tags"> {
  categoryName: string;
  categoryID: string;
  colorPicker: Partial<ColorPicker>;
}

function mapStateToProps(state: StoreState, props: RouterProps): Props {
  const params = path.params(props.location.pathname, pathlist.pathname);
  const category = state.todo.categories.find(a => a.id === params.categoryID);
  const form = state.form.find(a => a.id === FORM_ID);

  const tagNameInput: FormElementInput =
    form && form.inputs.find((input) => input.name === "tagName");

  const colorInput: FormElementInput =
    form && form.inputs.find((input) => input.name === "color");

  return {
    colorPicker: state.color.items.find((a) => a.id === COLOR_PICKER_ID) || {},
    categoryName: category && category.name,
    categoryID: params.categoryID,
    name: tagNameInput ? tagNameInput.value : "",
    color: colorInput ? colorInput.value : null,
    tags: state.tags,
  };
}

class TodoTags extends Component<Props, {}> {
  node: HTMLInputElement;

  addTag() {
    dispatch("CREATE_TAG", {
      name: this.props.name,
      color: this.props.color,
      categoryID: this.props.categoryID,
    } as Partial<Props>);
  }

  componentDidMount() {
    dispatch("GET_TAGS", {
      categoryID: this.props.categoryID,
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.categoryID !== this.props.categoryID) {
      dispatch("GET_TAGS", {
        categoryID: nextProps.categoryID,
      });
    }

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
      <Viewport
        titlebar={
          <Titlebar left={<h6>{this.props.categoryName}</h6>} />
        }
        toolbar={
          <Titlebar center={
            <FormConnect id={FORM_ID} onSubmit={() => this.addTag()}>
              <div className="todo-tags-input">
                <Swatch
                  background={this.props.color}
                  onClick={() => {
                    dispatch("COLOR_PICKER", {
                      type: "OPEN",
                      id: COLOR_PICKER_ID,
                    });
                  }}
                />
                <Input
                  className="todo-tags_tag-input"
                  onRef={(node) => { this.node = node as HTMLInputElement;}}
                  type="text"
                  formID={FORM_ID}
                  name="tagName"
                  onValue={value => this.setState({ todo: value })}
                  button={
                    <Button
                      icon="add"
                      onClick={() => this.addTag()}
                    />
                  }
                />
              </div>
            </FormConnect>
          } />
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
    );
  }
}

export default withStore(TodoTags, mapStateToProps)() as React.ComponentClass<any>;