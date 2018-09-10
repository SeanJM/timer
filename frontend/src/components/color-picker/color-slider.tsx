import React from "react";
import { DragMe } from "@frontend/components/drag-me";

interface ColorSliderProps {
  background: string;
  value: number;
  onInput: (e: { value: number }) => void;
}

export interface ColorSliderInputEvent {
  value: number;
}

export default class ColorSlider extends React.Component<ColorSliderProps> {
  node: HTMLDivElement;
  render() {
    return (
      <div className="color-picker_slider">
        <DragMe
          className="color-picker_slider-track"
          onDragMove={(e) => {
            this.props.onInput({
              value: e.positionX
            });
          }}
          onMouseDown={(e) => {
            this.props.onInput({
              value: e.positionX
            });
          }}>
          <div className="color-picker_slider-background" style={{
            background: this.props.background
          }}></div>
          <div className="color-picker_slider-face"></div>
          <div className="color-picker_slider-thumb" style={{
            left: this.props.value + "%"
          }}>
            <div className="color-picker_slider-thumb-stroke"></div>
            <div className="color-picker_slider-thumb-face"></div>
          </div>
        </DragMe>
      </div>
    );
  }
}