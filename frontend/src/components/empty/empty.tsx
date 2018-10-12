import React from "react";

interface EmptyProps {
  icon: JSX.Element;
  title: string;
  text?: string;
}

export function Empty(props: EmptyProps) {
  return (
    <div className="empty">
      {props.icon}
      <h6>{props.title}</h6>
      {props.text ? <p>{props.text}</p> : null}
    </div>
  );
}