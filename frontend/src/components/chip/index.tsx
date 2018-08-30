import React, { Component } from "react";
import { Checkbox } from "@frontend/components/checkbox";
import blush from "blush";

interface Props {
  id: string;
  label: string;
  color: string | null;
  checked: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export class ChipToggle extends Component<Props> {
  render() {
    const color = blush(this.props.color);
    const isDark = this.props.color ? color.getLightness() < 0.5 : false;
    const className = ["chip-toggle"];
    const textColor = isDark && this.props.color ? blush(color).lighten(0.5).hex() : this.props.color ? blush(color).darken(0.4).hex() : null;

    if (isDark) {
      className.push("chip-toggle--dark");
    }

    return (
      <div
        onClick={(e) => this.props.onClick(e)}
        className={className.join(" ")}>
        <Checkbox checked={this.props.checked} fill={color.darken(0.2).hex()}/>
        <div
          className="chip-toggle_color"
          style={{ background: this.props.color }}></div>
        <div
          className="chip-toggle_name"
          style={{ color: textColor }}>{this.props.label}</div>
      </div>
    );
  }
}