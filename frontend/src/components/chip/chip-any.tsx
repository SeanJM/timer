import React from "react";
import { Icon } from "@frontend/components/icon";

export interface ChipAnyProps {
  id: string;
  label: string;
  color?: string | null;
  type?: "outline";
  check?: boolean;
  isSelect?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

function ChipColor(props) {
  return (
    <div
      className="chip_color"
      style={{
        background: props.color,
      }}></div>
  );
}

export function ChipAny(props: ChipAnyProps) {
  const className = ["chip"];

  if (props.type) {
    className.push("chip--" + props.type);
  }

  if (props.color) {
    className.push("chip--color");
  }

  if (props.check) {
    className.push("chip--check");
  }

  return (
    <div
      onClick={props.onClick}
      className={className.join(" ")}>
      <div className="chip_face"></div>
      {props.color
        ? <ChipColor color={props.color}/>
        : null}
      {props.isSelect
        ? <div className="chip_check"><Icon type="check"/></div>
        : null}
      <div className="chip_label">{props.label}</div>
    </div>
  );
}