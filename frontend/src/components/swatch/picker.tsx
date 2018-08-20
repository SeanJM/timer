import React from "react";
import colors from "@components/swatch/colors";
import Swatch from "@components/swatch/swatch";

interface PickerProps {
  onSelect: (color: string) => void;
  selectedColor: string;
}

function Hue(props) {
  return (
    <Swatch
      className="swatch-hue"
      isSelected={props.selectedColor === props.background}
      onClick={() => props.onSelect(props.background)}
      background={props.background}/>
  );
}

export default class Picke extends React.Component<PickerProps> {
  render() {
    let i = -1;
    let n = colors.length;
    const colorElements = [];

    while (++i < n) {
      colorElements.push(
        <Hue
          key={colors[i]}
          background={colors[i]}
          selectedColor={this.props.selectedColor} 
          onSelect={this.props.onSelect}
        />
      );
    }

    return (
      <div className="swatch-picker_picker">
        <div className="swatch-picker_picker_hue">
          {colorElements}
        </div>
      </div>
    );
  }
}