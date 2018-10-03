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

function ButtonDone(props: { id: string, categoryID: string }) {
  return (
    <Button
      onClick={() => {
        dispatch("COMPLETE_TODO", {
          id: props.id,
          categoryID: props.categoryID,
        });
      }}
      icon="check"
    />
  );
}

function ButtonDelete(props: { id: string, categoryID: string }) {
  return (
    <Button
      onClick={() => {
        dispatch("DELETE_TODO", {
          id: props.id,
          categoryID: props.categoryID,
        });
      }}
      type="danger"
      icon="close"
    />
  );
}

function ButtonUndone(props: { id: string, categoryID: string }) {
  return (
    <Button
      onClick={() => {
        dispatch("INCOMPLETE_TODO", {
          id: props.id,
          categoryID: props.categoryID,
        });
      }}
      icon="history-back"
    />
  );
}

export function Todo(props: TodoProps) {
  const className = ["todo"];
  const { history } = props;

  className.push("todo-" + props.state);

  return (
    <ListItem
      isActive={props.isActive}
      passive={props.state === "complete"}
      title={
        <TodoTitle search={props.search}>{props.title}</TodoTitle>
      }
      timestamp={<Timestamp>{props.created}</Timestamp>}
      onClick={() => history.push({
        pathname: path.reduce(routes.pathname, {
          type: "todo",
          categoryID: props.categoryID,
          todoID: props.id
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
          {props.state === "complete"
            ? props.showAlt
              ? <ButtonUndone id={props.id} categoryID={props.categoryID} />
              : <ButtonDelete id={props.id} categoryID={props.categoryID} />
            : props.showAlt
              ? <ButtonDelete id={props.id} categoryID={props.categoryID} />
              : <ButtonDone id={props.id} categoryID={props.categoryID} />
          }
        </Control>
      }
    >
    </ListItem>
  );
}