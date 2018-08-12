import * as React from "react";

interface ModalWindowProps {
  head: JSX.Element;
  body: JSX.Element;
  feet: JSX.Element;
}

export function ModalWindow(props: ModalWindowProps) {
  return (
    <div className="modal-window">
      <div className="modal-window_head">{props.head}</div>
      <div className="modal-window_body">{props.body}</div>
      <div className="modal-window_feet">{props.feet}</div>
    </div>
  );
}