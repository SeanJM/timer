import * as React from "react";

interface ModalWindowProps {
  titlebar: JSX.Element;
  content: JSX.Element;
}

export function ModalWindow(props: ModalWindowProps) {
  return (
    <div className="modal-window">
      <div className="modal-window_tiltlebar">{props.titlebar}</div>
      <div className="modal-window_content">{props.content}</div>
    </div>
  );
}