import React from "react";
import Icon from "@components/icon";

interface ColorPickerSwatchProps {
  value: string;
  onAddToPalette: () => void;
}

export default function ColorPickerSwatch(props: ColorPickerSwatchProps) {
  return (
    <div className="color-picker-swatch">
      <div className="color-picker-swatch_face" style={{ background: props.value}}></div>
      <div className="color-picker-swatch_border"></div>
      <div
        onClick={() => props.onAddToPalette()}
        className="color-picker-swatch_add-to-palette">
        <Icon type="add"/>
      </div>
    </div>
  );
}