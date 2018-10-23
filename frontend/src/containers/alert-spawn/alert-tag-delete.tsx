import React from "react";

import { Alert } from "@components/alert";
import { AlertDefaultProps } from "./index";
import { Button } from "@components/button";
import { Control } from "@components/control";
import pluralize from "@pluralize";

import { dispatch } from "@action";

export interface AlertTagDeleteProps extends AlertDefaultProps {
  categoryID: string;
  idList: string[];
  close: () => void;
}

export class AlertTagDelete extends React.Component<AlertTagDeleteProps> {
  close = () => {
    const { close, categoryID, idList } = this.props;
    close();
    dispatch("TAG", {
      type: "DELETE",
      value: {
        categoryID,
        idList,
      }
    });
  }

  render() {
    const { idList, close } = this.props;
    const { length } = idList;
    return (
      <Alert
        {...this.props}
        title={`Confirm Delete`}
        content={<p>{`Are you sure you want to delete ${length} ${pluralize("tag", "tags", length)}?`}</p>}
        control={
          <Control>
            <Button
              autofocus
              onClick={this.close}
              variant="primary"
            >OK</Button>
            <Button onClick={close}>Cancel</Button>
          </Control>
        }
      />
    );
  }
}