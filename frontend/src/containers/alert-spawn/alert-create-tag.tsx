import React from "react";

import { Alert } from "@components/alert";
import { AlertDefaultProps } from "./index";
import { Button } from "@components/button";
import { Control } from "@components/control";
import { ChipSubmitEvent } from "@components/chip";
import { dispatch } from "@action";

export interface AlertCreateProps extends
  AlertDefaultProps,
  Pick<ChipSubmitEvent, "clearValue"> {
  categoryID: string;
  idList: string[];
  name: string;
}

export function AlertCreateTag(props: AlertCreateProps) {
  const {
    categoryID,
    clearValue,
    close,
    idList,
    name,
  } = props;
  return (
    <Alert
      title={`Confirm tag creation`}
      content={<p>{`Are you sure you want to create "${name}" tag?`}</p>}
      control={
        <Control>
          <Button
            autofocus
            onClick={() => {
              close();
              clearValue();
              dispatch("TAG", {
                type: "CREATE",
                value: {
                  categoryID,
                  idList,
                  name,
                }
              });
          }} variant="primary">OK</Button>
          <Button onClick={close}>Cancel</Button>
        </Control>
      }
    />
  );
}