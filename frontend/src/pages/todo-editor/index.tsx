import React from "react";
import { withStore, StoreState } from "@frontend/store";
import { FormConnect } from "@frontend/components/form";
import { InputGroup } from "@frontend/components/input-group";
import { TagResponse, StoreForm } from "types";
import generateHash from "@generate-hash";
import { emptyForm } from "@frontend/action/form";
import { InputText } from "@frontend/components";
import { InputChipSelect, ChipDataElement } from "@frontend/components/Input/input-chip-select";
import { Viewport } from "@frontend/components/viewport";
import { RouterProps } from "@frontend/components/router";
import { TitleAndInput } from "@frontend/components/title-and-input";
import { dispatch } from "@frontend/action";
import Titlebar from "@frontend/components/titlebar";

const FORM_ID = generateHash();

interface SlideOutTodoProps extends RouterProps {
}

interface SlideOutTodoMappedProps
  extends SlideOutTodoProps {
  todoName: string;
  categoryName: string;
  categoryID: string;
  todoID: string;
  tags: TagResponse[];
  form: StoreForm;
}

function mapStateToProps(state: StoreState, props: SlideOutTodoProps): SlideOutTodoMappedProps {
  const { categoryID, todoID } = props.params;
  const category = state.todo.categories.find(a => a.id === categoryID);
  const tagCategory = state.tags.categories.find(a => a.id === categoryID) || { tags: [] };
  return {
    history: props.history,
    location: props.location,
    params: props.params,

    todoName: category.todos.find(a => a.id === todoID).name,
    categoryName: category.name,
    categoryID,
    todoID,
    tags: tagCategory.tags,
    form: state.form[FORM_ID] || emptyForm(FORM_ID),
  };
}

function TodoEditor(props: SlideOutTodoMappedProps) {
  return (
    <div className="todo-editor">
      <Viewport
        titlebar={
          <Titlebar>
            <TitleAndInput
              icon="edit"
              defaultValue={props.todoName}
              title={props.todoName}
              component={InputText}
              onSubmit={(value) => dispatch("TODO", {
                type: "EDIT",
                value: {
                  categoryID: props.categoryID,
                  todoID: props.todoID,
                  name: value,
                }
              })}
            />
          </Titlebar>
        }
        body={
          <div>
            <FormConnect id={FORM_ID}>
            <InputGroup name="todoName" formID={FORM_ID}>
            <label>Todo name</label>
            <InputText defaultValue={props.todoName}/>
            </InputGroup>
            <InputGroup name="todoTags" formID={FORM_ID}>
            <label>Todo tags</label>
            <InputChipSelect data={props.tags.map(a => {
              return {
                id: a.id,
                label: a.name,
                color: a.color,
              } as ChipDataElement
            })}/>
            </InputGroup>
            </FormConnect>
          </div>
        }
      />
    </div>
  );
}

export const TodoEditorConnect =
  withStore<SlideOutTodoProps>(TodoEditor as React.ComponentType, mapStateToProps)();