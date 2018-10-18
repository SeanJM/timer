import React from "react";

import { Alert } from "@components/alert";
import { AlertDefaultProps } from "./index";
import { Button } from "@components/button";
import { Control } from "@components/control";
import pluralize from "@pluralize";

import { dispatch } from "@action";

export interface AlertTodoDeleteProps extends AlertDefaultProps {
  categoryID: string;
  idList: string[];
  close: () => void;
}

export function AlertTodoDelete(props: AlertTodoDeleteProps) {
  const { length } = props.idList;
  return (
    <Alert
      {...props}
      title={`Confirm Delete`}
      content={<p>{`Are you sure you want to delete ${length} ${pluralize("todo", "todos", length)}?`}</p>}
      control={
        <Control>
          <Button autofocus onClick={() => {
            props.close();
            dispatch("TODO", {
              type: "DELETE",
              value: {
                categoryID: props.categoryID,
                idList: props.idList,
              }
            });
          }} variant="primary">OK</Button>
          <Button onClick={props.close}>Cancel</Button>
        </Control>
      }
    />
  );
}