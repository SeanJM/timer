import React from "react";
import Button from "@components/button";
import { Link } from "@components/router";
import Control from "@components/control";
import path from "@path";
import { dispatch } from "@action";

function timestamp(n: number) {
  const d = new Date(n);
  const date = d.getFullYear() + "-" + ("0" + d.getMonth()).substr(-2) + "-" + ("0" + d.getDate()).substr(-2);
  const time = (d.getHours() % 12) + ":" + d.getMinutes() + (d.getHours() > 12 ? "PM" : "AM");
  return date + " " + time
}

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
    <div className={className.join(" ")}>
      <h5>{props.name}</h5>
      <p>{timestamp(props.created)}</p>
      <Link
        className="todo_link"
        to={path.join("/todo/category/", props.categoryID, props.id)}
      />
      <Control className="todo_control">
        {props.state === "complete"
          ? props.showAlt ? <ButtonUndone id={props.id} categoryID={props.categoryID} /> : <ButtonDelete id={props.id} categoryID={props.categoryID} />
          : props.showAlt ? <ButtonDelete id={props.id} categoryID={props.categoryID} /> : <ButtonDone id={props.id} categoryID={props.categoryID} />
        }
      </Control>
    </div>
  );
}