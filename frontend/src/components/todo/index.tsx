import React from "react";
import Button from "@components/button";
import Control from "@components/control";
import { ListItem } from "@components/list";
import path from "@path";
import { dispatch } from "@action";
import Timestamp from "@components/timestamp";

interface TodoProps {
  state: string;
  name: string;
  categoryID: string;
  id: string;
  created: number;
  showAlt: boolean;
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
      type="positive"
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

export default function Todo(props: TodoProps) {
  const className = ["todo"];
  className.push("todo-" + props.state);
  return (
    <ListItem
      passive={props.state === "complete"}
      title={props.name}
      timestamp={<Timestamp>{props.created}</Timestamp>}
      to={path.join("/category/", props.categoryID, props.id)}
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