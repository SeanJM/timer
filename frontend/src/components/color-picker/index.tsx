import React, { Fragment } from "react";
import { withStore, StoreState } from "@frontend/store";
import { ColorPicker } from "@types";
import { dispatch } from "@frontend/action/";
import blush from "blush";
import { Button } from "@frontend/components/button";
import { Control } from "@frontend/components/control";
import ColorPickerSwatch from "./color-picker-swatch";
import ColorPickerPalette from "@frontend/components/color-picker/color-picker-palette";
import { HueSlider, LightnessSlider, SaturationSlider } from "./hsl-sliders";

interface PickerProps {
  colorPickers: ColorPicker[];
}

interface ColorPickerState {
  pageY: number;
  pageX: number;
  value: string;
}

interface ColorPickerProps extends Partial<ColorPicker>, Partial<ColorPickerState> {
  onValue(value: number): void;
}

function mapStateToProps(state: StoreState): PickerProps {
  return {
    colorPickers: state.color.colorPickers
  };
}

class ColorPickerView extends React.Component<ColorPickerProps, ColorPickerState> {
  node: HTMLDivElement;

  constructor(props: ColorPickerProps) {
    super(props);
    this.state = {
      pageX: props.pageX,
      pageY: props.pageY,
      value: props.value,
    };
  }

  componentDidMount() {
    const offset = this.node.getBoundingClientRect();
    if (this.state.pageX + offset.width > window.innerWidth) {
      this.setState({
        pageX: window.innerWidth - offset.width - 20
      });
    }
    if (this.state.pageY + offset.height > window.innerHeight) {
      this.setState({
        pageY: window.innerHeight - offset.height + 10
      });
    }
  }

  onAddToPalette() {
    dispatch("COLOR", {
      type: "ADD_TO_PALETTE",
      value: this.state.value
    });
  }

  onHueValue(value: number) {
    this.setState({
      value: blush(this.state.value).setHue(value).hex(),
    });
  }

  onSaturationValue(value: number) {
    this.setState({
      value: blush(this.state.value).setSaturation(value).hex(),
    });
  }

  onLightnessValue(value: number) {
    this.setState({
      value: blush(this.state.value).setLightness(value).hex(),
    });
  }

  onPaletteSelect(value: string) {
    this.setState({
      value: value
    });
  }

  render() {
    return  (
      <div
        ref={(node) => { this.node = node; }}
        className="color-picker"
        style={{
          left: this.state.pageX - 4,
          top: this.state.pageY + 4,
        }}
      >
        <div className="color-picker_head">
          <div className="color-picker_title"></div>
        </div>
        <div className="color-picker_body">
          <ColorPickerSwatch
            onAddToPalette={() => this.onAddToPalette()}
            value={this.state.value}
          />
          <div className="color-picker-right">
            <small><h6>Hue</h6></small>
            <HueSlider
              value={this.state.value}
              onInput={(e) => this.onHueValue(e.value)}/>
            <small><h6>Saturation</h6></small>
            <SaturationSlider
              value={this.state.value}
              onInput={(e) => this.onSaturationValue(e.value)}/>
            <small><h6>Lightness</h6></small>
            <LightnessSlider
              value={this.state.value}
              onInput={(e) => this.onLightnessValue(e.value)}/>
            <small><h6>Palette</h6></small>
            <ColorPickerPalette
              value={this.state.value}
              onSelect={(value) => this.onPaletteSelect(value)}/>
          </div>
        </div>
        <div className="color-picker_feet">
          <Control>
            <Button onClick={() => {
              dispatch("COLOR_PICKER", {
                type: "CLOSE",
                id: this.props.id,
                value: this.state.value,
              });
            }} type="primary">OK</Button>
            <Button onClick={() => {
              dispatch("COLOR_PICKER", {
                type: "CLOSE",
                id: this.props.id,
                value: null,
              });
            }}>Cancel</Button>
          </Control>
        </div>
      </div>
    );
  }
}

class ColorPickerSpawn extends React.Component<Partial<PickerProps>, Pick<ColorPickerState, "pageX" | "pageY">> {
  constructor(props) {
    super(props);
    this.state = {
      pageX: 0,
      pageY: 0,
    };
  }

  componentDidMount() {
    dispatch("COLOR", { type: "GET_PALETTE" });
    document.body.addEventListener("mousedown", (e: MouseEvent) => {
      this.setState({
        pageY: e.pageY,
        pageX: e.pageX,
      });
    });
  }

  onValue(e) {
    console.log(e);
  }

  render() {
    return (
      <Fragment>
        {this.props.colorPickers
          .filter((colorPickerItem) => colorPickerItem.isOpen)
          .map((colorPickerItem) => {
            return (
            <ColorPickerView
              {...colorPickerItem}
              onValue={(e) => this.onValue(e)}
              key={colorPickerItem.id}
              value={colorPickerItem.value}
              pageY={this.state.pageY}
              pageX={this.state.pageX}
            />);
          })}
      </Fragment>
    );
  }
}

export const ColorPickerSpawnConnect =
  withStore(ColorPickerSpawn as React.ComponentType, mapStateToProps)();