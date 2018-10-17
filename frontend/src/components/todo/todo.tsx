import React from "react";
import { ButtonConfirm } from "@frontend/components/button-confirm";
import { Control } from "@frontend/components/control";
import { dispatch } from "@frontend/action/";
import { ListItem } from "@frontend/components/list";
import { Timestamp } from "@frontend/components/timestamp";
import { TodoPriority } from "./todo-priority";
import { TodoTitle } from "./todo-title";

interface TodoProps {
  active: boolean;
  categoryID: string;
  completedDate?: null | number;
  created: number;
  id: string;
  onClick?: (e: React.MouseEvent) => void;
  priority: number;
  priorityLength: number;
  search?: string;
  selected?: boolean;
  showAlt: boolean;
  state: string;
  title: string;
}

function TodoCheck(props: { checked: boolean, id: string, categoryID: string }) {
  const type = props.checked
    ? "INCOMPLETE"
    : "COMPLETE";

  return (
    <input type="checkbox"
      readOnly
      checked={props.checked}
      onClick={() => dispatch("TODO", {
        type,
        value: {
          idList: [ props.id ],
          categoryID: props.categoryID,
        }
      })}
    />
  );
}

function ButtonDelete(value: { id: string, categoryID: string }) {
  return (
    <ButtonConfirm
      type="danger"
      onClick={() => dispatch("TODO", {
        type: "DELETE",
        value
      })}
    >
      Delete
    </ButtonConfirm>
  );
}

export function Todo(props: TodoProps) {
  const className = ["todo"];

  const {
    categoryID,
    created,
    selected,
    onClick,
    id,
    active,
    search,
    showAlt,
    state,
    title
  } = props;

  className.push("todo-" + state);

  return (
    <ListItem
      active={active}
      selected={selected}
      passive={state === "complete"}
      title={<TodoTitle search={search}>{title}</TodoTitle>}
      timestamp={<Timestamp>{created}</Timestamp>}
      showAlt={showAlt}
      onClick={onClick}

      secondaryAction={
        <TodoPriority
          priority={props.priority}
          priorityLength={props.priorityLength}
        />
      }

      primaryAction={
        <Control>
          <TodoCheck
            categoryID={categoryID}
            checked={state === "complete"}
            id={id}
          />
        </Control>
      }

      altAction={<ButtonDelete id={id} categoryID={categoryID}/>}
    >
    </ListItem>
  );
}