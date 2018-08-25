import React from "react";
import blush from "blush";
import ColorSlider, { ColorSliderInputEvent } from "./color-slider";

export function HueSlider(props: { value: string, onInput: (e: ColorSliderInputEvent) => void }) {
  let i = -1;
  const n = 12;
  const color = blush(props.value).setHue(0);
  const hueList = [];
  const value = blush(props.value).getHue() / 360 * 100;

  while (++i < n) {
    hueList.push(
      blush(color).rotate((i / (n - 1)) * 360).hex()
    );
  }

  return (
    <ColorSlider
      onInput={e => props.onInput({ value: Math.round(e.value * 360) })}
      value={value}
      background={
        "linear-gradient(to right, " + hueList.join(",") + ")"
      }/>
  );
}

export function SaturationSlider(props) {
  let i = -1;
  const n = 3;
  const color = blush(props.value).setSaturation(0);
  const hueList = [];
  const value = blush(props.value).getSaturation() * 100;

  while (++i < n) {
    hueList.push(
      blush(color).saturate(i / (n - 1)).hex()
    );
  }

  return (
    <ColorSlider
      onInput={e => props.onInput({ value: e.value })}
      value={value}
      background={
        "linear-gradient(to right, " + hueList.join(",") + ")"
      }/>
  );
}

export function LightnessSlider(props) {
  let i = -1;
  const n = 3;
  const color = blush(props.value).setLightness(0);
  const hueList = [];
  const value = blush(props.value).getLightness() * 100;

  while (++i < n) {
    hueList.push(
      color.setLightness((i / (n - 1))).hex()
    );
  }

  return (
    <ColorSlider
      onInput={e => props.onInput({ value: e.value })}
      value={value}
      background={
        "linear-gradient(to right, " + hueList.join(",") + ")"
      }/>
  );
}