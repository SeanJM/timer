import React from "react";
import Titlebar from "@frontend/components/titlebar";
import Control from "@frontend/components/control";
import { SlideOut } from "@frontend/containers/slide-out";

interface SlideOutTodoProps {
  categoryID: string;
  todoID: string;
}

export default function SlideOutTodo(props: SlideOutTodoProps) {
  return (
    <SlideOut
      head={<Titlebar></Titlebar>}
      body={<Titlebar></Titlebar>}
      feet={<Control></Control>}
    />
  );
}