import React from "react";
import { Icon } from "@frontend/components/icon";

export interface ChipRemoveEvent {
  type: "chipremove";
  id: string;
}

export interface ChipProps {
  id: string;
  label: string;
  color?: string | null;
  type?: "outline";
  check?: boolean;
  isSelect?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onRemove?: (e: ChipRemoveEvent) => void;
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

export class Chip extends React.Component<ChipProps> {
  removeDidClick = () => {
    const { onRemove, id } = this.props;
    onRemove({
      type: "chipremove",
      id,
    })
  }

  render() {
    const className = ["chip"];
    const {
      check,
      color,
      isSelect,
      label,
      onClick,
      onRemove,
      type,
    } = this.props;

    if (type) {
      className.push("chip--" + type);
    }

    if (color) {
      className.push("chip--color");
    }

    if (check) {
      className.push("chip--check");
    }

    if (onRemove) {
      className.push("chip--remove");
    }

    return (
      <div
        onClick={onClick}
        className={className.join(" ")}>
        <div className="chip_face"></div>
        {color
          ? <ChipColor color={color}/>
          : null}
        {isSelect
          ? <div className="chip_check"><Icon type="check"/></div>
          : null}
        <div className="chip_label">{label}</div>
        {onRemove
          ? <div className="chip_remove" onClick={this.removeDidClick}><Icon type="close"/></div>
          : null}
      </div>
    );
  }
}