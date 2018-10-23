import React from "react";
import { dialogsByType } from "./dialogs-by-type";
import { withStore, StoreState } from "@store";
import { dispatch } from "@action";

function mapStateToProps(state: StoreState): Dialogs.Props {
  return {
    dialogs: state.dialogs,
  };
}

class DialogSpawn extends React.Component<Dialogs.Props> {
  close(id) {
    dispatch("DIALOG", {
      type: "CLOSE",
      value: {
        id,
      },
    });
  }

  render() {
    return (
      <div className="dialogs">
        {this.props.dialogs.map((dialog) => {
          const DialogElement = dialogsByType[dialog.type];
          return <DialogElement
            {...dialog}
            key={dialog.id}
            close={() => this.close(dialog.id)}
          />;
        })}
      </div>
    );
  }
}

export const DialogSpawnConnect = withStore(DialogSpawn, mapStateToProps)();

namespace Dialogs {
  export interface Props {
    dialogs: StoreState["dialogs"];
  }
}

export { DialogSpawn };