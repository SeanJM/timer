import React from "react";
import { withStore, StoreState, StoreAlert } from "@store";
import { alertByType } from "./alert-by-type";
import { dispatch } from "@action";

interface AlertsProps extends Partial<JSX.ElementChildrenAttribute> {
  alerts: StoreAlert[];
}

export interface AlertDefaultProps {
  type: string;
  id: string;
  onEsc: () => void;
  close: () => void;
}

function mapStateToProps(state: StoreState): AlertsProps {
  return {
    alerts: state.alerts,
  };
}

export class AlertsView extends React.Component<AlertsProps> {
  render() {
    const classList = [ "alerts" ];

    if (this.props.alerts.length) {
      classList.push("alerts--open");
    }

    return (
      <div className={classList.join(" ")}>
        {this.props.alerts.map((a) => {
          const AlertElement = alertByType[a.type];

          const close = () => dispatch("ALERT", {
            type: "POP",
            value: { id: a.id }
          });

          return (
            <AlertElement
              {...a}
              key={a.id}
              onEsc={close}
              close={close}
            />
          );
        })}
      </div>
    );
  }
}

export const AlertsConnect = withStore(AlertsView, mapStateToProps)();