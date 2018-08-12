import React from "react";
import Button from "@components/button";
import Control from "@components/control";
import { dispatch } from "@action";

function timestamp(n: number) {
  const d = new Date(n);
  const date = d.getFullYear() + "-" + ("0" + d.getMonth()).substr(-2) + "-" + ("0" + d.getDate()).substr(-2);
  const time = (d.getHours() % 12) + ":" + d.getMinutes() + (d.getHours() > 12 ? "PM" : "AM");
  return date + " " + time
}

interface TodoProps {
  name: string;
  categoryID: string;
  id: string;
  created: number;
  showDelete: boolean;
}

function ButtonDone(props: { id: string, categoryID: string }) {
  return (
    <Button
      onClick={() => {
        dispatch("TODO_DONE", {
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
        dispatch("TODO_DELETE", {
          id: props.id,
          categoryID: props.categoryID,
        });
      }}
      type="danger"
      icon="close"
    />
  );
}

export default function Todo(props: TodoProps) {
  return (
    <div className="todo">
      <div className="todo_container">
        <h5>{props.name}</h5>
        <p>{timestamp(props.created)}</p>
        <Control className="todo_control">
          {props.showDelete
            ? <ButtonDelete id={props.id} categoryID={props.categoryID} />
            : <ButtonDone id={props.id} categoryID={props.categoryID} />
          }
        </Control>
      </div>
    </div>
  );
}