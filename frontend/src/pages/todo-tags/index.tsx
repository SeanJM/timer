import React, { Component } from "react";
import Button from "@components/button";
import { Input } from "@components/input";
import { FormConnect } from "@components/form";
import { RouterProps } from "@components/router";
import Titlebar from "@components/titlebar";
import SwatchPicker from "@components/swatch";
import generateHash from "@generate-hash";
import { withStore, StoreState, FormElementInput, TagNode } from "@store";
import path from "@path";
import { dispatch } from "@action";
import { routes } from "@components/app";
import { List, ListItem } from "@components/list";
import Timestamp from "@components/timestamp";

const FORM_ID = generateHash();

interface Props extends Partial<TagNode>, Pick<StoreState, "tags"> {
  categoryName: string;
  categoryID: string;
}

function mapStateToProps(state: StoreState, props: RouterProps): Props {
  const params = path.params(props.location.pathname, routes.category);
  const category = state.todo.categories.find(a => a.attributes.id === params.categoryID);
  const form = state.form.find(a => a.id === FORM_ID);

  const tagNameInput: FormElementInput = 
    form && form.inputs.find((input) => input.name === "tagName");
  const colorInput: FormElementInput = 
    form && form.inputs.find((input) => input.name === "color");

  return {
    categoryName: category && category.attributes.name,
    categoryID: params.categoryID,
    name: tagNameInput ? tagNameInput.value : "",
    colorID: colorInput ? colorInput.value : -1,
    tags: state.tags,
  };
}

class TodoTags extends Component<Props, {}> {
  node: HTMLInputElement;

  addTag() {
    dispatch("CREATE_TAG", {
      name: this.props.name,
      colorID: this.props.colorID,
      categoryID: this.props.categoryID,
    } as Partial<Props>);
  }

  componentDidMount() {
    dispatch("GET_TAGS", {
      categoryID: this.props.categoryID,
    });
  }

  render() {
    return (
      <div className="todo-tags">
        <div className="todo-titlebar">
          <Titlebar left={<h6>{this.props.categoryName}</h6>} />
          <Titlebar center={
            <FormConnect id={FORM_ID} onSubmit={() => this.addTag()}>
              <SwatchPicker 
                onSelect={(color) => {
                  dispatch("FORM_VALUE", {
                    id: FORM_ID,
                    type: "text",
                    name: "color",
                    value: color.index
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