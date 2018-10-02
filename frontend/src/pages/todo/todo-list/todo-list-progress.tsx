import React from "react";
import { TodoResponse } from "@types";

interface TodoListProgressProps {
  incompleteTodos: TodoResponse[];
  completeTodos: TodoResponse[];
}

function chunk(i, n) {
  return (
    <div
      key={i}
      style={{ width: (100 / n) + "%" }}
      className={`todo-list_progress-bar-chunk todo-list_progress-bar-chunk--${i === 0 ? "first" : i === n - 1 ? "last" : "member"}`}>
      <span/>
    </div>
  );
}

export function TodoListProgress({ completeTodos, incompleteTodos }: TodoListProgressProps) {
  const completeLength = completeTodos.length;
  const incompleteLength = incompleteTodos.length;
  const total = completeLength + incompleteLength;

  const incompleteChildren = [];
  const completeChildren = [];

  incompleteTodos.forEach((a, i) => {
    incompleteChildren.push(chunk(i, incompleteLength));
  });

  completeTodos.forEach((a, i) => {
    completeChildren.push(chunk(i, completeLength));
  });

  return (
    <div className="todo-list_progress">
      <div className="todo-list_progress-background"/>
      <div className="todo-list_progress-bar">
        <div
          className="todo-list_progress-bar-complete"
          style={{
            width: ((completeLength / total) * 100) + "%"
          }}
        >
          {completeChildren}
        </div>
        <div
          className="todo-list_progress-bar-incomplete"
          style={{
            width: ((incompleteLength / total) * 100) + "%"
          }}
          >
          {incompleteChildren}
        </div>
      </div>
    </div>
  );
}