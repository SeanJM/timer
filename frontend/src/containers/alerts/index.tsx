import React from "react";
import { withStore, StoreState, StoreAlert } from "@store";
import { alertByType } from "./alert-by-type";
import { dispatch } from "@action";

interface AlertsProps extends Partial<JSX.ElementChildrenAttribute> {
  alerts: StoreAlert[];
}

function mapStateToProps(state: StoreState): AlertsProps {
  return {
    alerts: state.alerts,
  };
}

export function AlertsView(props: AlertsProps) {
  const classList = [ "alerts" ];

  if (props.alerts.length) {
    classList.push("alerts--open");
  }

  return (
    <div className={classList.join(" ")}>
      {props.alerts.map((a) => {
        const AlertElement = alertByType[a.type];
        return (
          <AlertElement
            {...a}
            key={a.id}
            close={() => dispatch("ALERT", {
              type: "POP",
              value: { id: a.id }
            })}
          />
        );
      })}
    </div>
  );
}

export const AlertsConnect = withStore(AlertsView, mapStateToProps)();