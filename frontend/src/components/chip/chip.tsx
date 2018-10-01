import React from "react";
import { Icon } from "@frontend/components/icon";

export interface ChipProps {
  id: string;
  label: string;
  color?: string | null;
  type?: "outline";
  check?: boolean;
  isSelect?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onRemove?: (e: React.MouseEvent) => void;
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

export function Chip(props: ChipProps) {
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

  if (props.onRemove) {
    className.push("chip--remove");
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
      {props.onRemove
        ? <div className="chip_remove" onClick={props.onRemove}><Icon type="close"/></div>
        : null}
    </div>
  );
}