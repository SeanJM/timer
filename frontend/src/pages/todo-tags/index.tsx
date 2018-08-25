import React, { Component } from "react";
import Button from "@components/button";
import { Input } from "@components/input";
import { FormConnect } from "@components/form";
import { RouterProps } from "@components/router";
import Titlebar from "@components/titlebar";
import Swatch from "@components/swatch";
import generateHash from "@generate-hash";
import { withStore, StoreState, FormElementInput, TagNode } from "@store";
import { ColorPicker } from "@types";
import path from "@path";
import { dispatch } from "@action";
import { routes } from "@components/app";
import { List, ListItem } from "@components/list";
import Timestamp from "@components/timestamp";

const FORM_ID = generateHash();
const COLOR_PICKER_ID = "tag_name";

interface Props extends Partial<TagNode>, Pick<StoreState, "tags"> {
  categoryName: string;
  categoryID: string;
  colorPicker: Partial<ColorPicker>;
}

function mapStateToProps(state: StoreState, props: RouterProps): Props {
  const params = path.params(props.location.pathname, routes.pathname);
  const category = state.todo.categories.find(a => a.attributes.id === params.categoryID);
  const form = state.form.find(a => a.id === FORM_ID);

  const tagNameInput: FormElementInput =
    form && form.inputs.find((input) => input.name === "tagName");

  const colorInput: FormElementInput =
    form && form.inputs.find((input) => input.name === "color");

  return {
    colorPicker: state.color.items.find((a) => a.id === COLOR_PICKER_ID) || {},
    categoryName: category && category.attributes.name,
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
      <div className="todo-tags">
        <div className="todo-titlebar">
          <Titlebar left={<h6>{this.props.categoryName}</h6>} />
          <Titlebar center={
            <FormConnect id={FORM_ID} onSubmit={() => this.addTag()}>
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
            </FormConnect>
          } />
        </div>
        <div className="todo-list_content">
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
        </div>
      </div>
    );
  }
}

export default withStore(TodoTags, mapStateToProps)() as React.ComponentClass<any>;