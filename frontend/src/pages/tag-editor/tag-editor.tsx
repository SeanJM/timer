import React, { Component } from "react";
import { Viewport } from "@frontend/components/viewport";
import { FormConnect } from "@frontend/components/form";
import { InputGroup } from "@frontend/components/input-group";
import generateHash from "@generate-hash";
import { WithRouterProps } from "@frontend/components/router";
import path, { PathParams } from "@path";
import { dispatch } from "@frontend/action";
import { withStore, StoreState } from "@frontend/store";
import { Titlebar } from "@frontend/components/titlebar";
import { Button } from "@frontend/components/button";
import { TitleAndInput } from "@frontend/components/title-and-input";
import { TagResponse } from "types";
import { emptyForm } from "@frontend/action/form";
import { InputText } from "@frontend/components/input";
import { Swatch } from "@frontend/components/swatch";

const FORM_ID = generateHash();
const COLOR_PICKER_ID = generateHash();

interface TagEditorIncomingProps extends WithRouterProps {
  params: PathParams<{
    type: "filters";
    categoryID: string;
    elementID: string;
  }>;
}

interface TagEditorProps extends TagEditorIncomingProps {
  tag: TagResponse;
  form: {
    name: string;
    color: string | undefined;
  };
}

function mapStateToProps(state: StoreState, props: TagEditorIncomingProps): TagEditorProps {
  const { categoryID, elementID } = props.params;
  const categoryResponse = state.todo.categories.find((a) => a.id === categoryID);
  const tagResponse = categoryResponse.tags.find((a) => a.id === elementID);
  const form = state.form[FORM_ID]|| emptyForm(FORM_ID, ["tagName"]);
  const colorPicker = state.color.colorPickers.find((a) => a.id === COLOR_PICKER_ID) || { value: undefined };
  return {
    ...props,
    tag: tagResponse,
    form: {
      name: form.input.tagName.value,
      color: colorPicker.value,
    }
  };
}

class TagEditorView extends Component<TagEditorProps> {
  save() {
    dispatch("TAG", {
      type: "EDIT",
      value: {
        id: this.props.tag.id,
        name: this.props.form.name,
        color: this.props.form.color,
        categoryID: this.props.params.categoryID,
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.form.color !== prevProps.form.color) {
      this.save();
    }
  }

  render() {
    const { history, tag, form } = this.props;
    return (
      <div className="tag-editor">
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
                  name="tagName"
                  defaultValue={tag.name}
                  title={form.name || tag.name}
                  component={InputText}
                  onSubmit={() => this.save()}
                  onValue={(e) => dispatch("FORM_VALUE", {
                    id: FORM_ID,
                    ...e
                  })}
                />
              </Titlebar>
          }
          body={
            <FormConnect type="borderless" id={FORM_ID}>
              <InputGroup name="todoTags">
                <label>Color</label>
                <Swatch
                  background={form.color || tag.color}
                  onClick={() => dispatch("COLOR_PICKER", {
                    type: "OPEN",
                    id: COLOR_PICKER_ID,
                    value: tag.color,
                  })}
                />
              </InputGroup>
            </FormConnect>
          }
        />
      </div>
    );
  }
}

export const TagEditorConnect = withStore(TagEditorView, mapStateToProps)();