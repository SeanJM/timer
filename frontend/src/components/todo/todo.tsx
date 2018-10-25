import React from "react";
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
    state,
    title
  } = props;

  className.push("todo-" + state);

  return (
    <ListItem
      id={id}
      active={active}
      selected={selected}
      passive={state === "complete"}
      title={<TodoTitle search={search}>{title}</TodoTitle>}
      timestamp={<Timestamp>{created}</Timestamp>}
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
    >
    </ListItem>
  );
}