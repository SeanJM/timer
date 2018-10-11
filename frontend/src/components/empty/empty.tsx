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
      <h5>{props.title}</h5>
      {props.text ? <p>{props.text}</p> : null}
    </div>
  );
}