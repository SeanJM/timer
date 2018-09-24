import React from "react";

export interface TodoPriorityProps {
  priority: number;
  priorityLength: number;
}

export function TodoPriority(props: TodoPriorityProps) {
  let i = -1;
  const n = props.priorityLength;
  const children = [];

  while (++i < n) {
    children.push(
      <div
        key={i}
        className={`todo-priority_element ${i < props.priority ? "todo-priority_element-active" : ""}`}/>
    );
  }

  children.reverse();

  return (
    <div
      className={`todo-priority todo-priority-${props.priority}-${n}`}>
      {children}
     </div>
  );
}