import React from "react";

import { Alert } from "@components/alert";
import { Button } from "@components/button";
import { Control } from "@components/control";
import { dispatch } from "@action";
import { TodoResponse } from "@types";

export interface AlertTodoDeleteProps {
  categoryID: string;
  todos: TodoResponse[];
  close: () => void;
}

export function AlertTodoDelete(props: AlertTodoDeleteProps) {
  return (
    <Alert
      title="Confirm"
      content={<p>This cannot be undone</p>}
      control={
        <Control>
          <Button autofocus onClick={() => {
            props.close();
            dispatch("TODO", {
              type: "DELETE",
              value: {
                categoryID: props.categoryID,
                todos: props.todos,
              }
            });
          }} type="primary">OK</Button>
          <Button onClick={props.close}>Cancel</Button>
        </Control>
      }
    />
  );
}