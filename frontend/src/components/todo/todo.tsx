import path from "@path";
import React from "react";
import { Button } from "@frontend/components/button";
import { Control } from "@frontend/components/control";
import { dispatch } from "@frontend/action/";
import { ListItem } from "@frontend/components/list";
import { RouterHistory } from "@frontend/components/router";
import { routes } from "@frontend/routes";
import { Timestamp } from "@frontend/components/timestamp";
import { TodoPriority } from "./todo-priority";
import { TodoTitle } from "./todo-title";

interface TodoProps {
  categoryID: string;
  completedDate?: null | number;
  created: number;
  search?: string;
  history: RouterHistory;
  id: string;
  isActive: boolean;
  title: string;
  priority: number;
  priorityLength: number;
  showAlt: boolean;
  state: string;
}

function TodoCheck(props: { checked: boolean, id: string, categoryID: string }) {
  const type = props.checked
    ? "INCOMPLETE"
    : "COMPLETE";

  return (
    <input type="checkbox"
      checked={props.checked}
      onClick={() => dispatch("TODO", {
        type,
        value: {
          id: props.id,
          categoryID: props.categoryID,
        }
      })}
    />
  );
}

function ButtonDelete(value: { id: string, categoryID: string }) {
  return (
    <Button type="danger"
      onClick={() => dispatch("TODO", { type: "DELETE", value })}
    >
      Delete
    </Button>
  );
}

export function Todo(props: TodoProps) {
  const className = ["todo"];

  const {
    categoryID,
    created,
    history,
    id,
    isActive,
    search,
    state,
    title
  } = props;

  className.push("todo-" + state);

  return (
    <ListItem
      isActive={isActive}
      passive={state === "complete"}
      title={<TodoTitle search={search}>{title}</TodoTitle>}
      timestamp={<Timestamp>{created}</Timestamp>}

      onClick={() => history.push({
        pathname: path.reduce(routes.pathname, {
          type: "todo",
          categoryID,
          todoID: id
        })
      })}

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
      footer={
        props.showAlt
          ? <ButtonDelete id={id} categoryID={categoryID}/>
          : null
      }
    >
    </ListItem>
  );
}