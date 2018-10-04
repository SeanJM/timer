import React from "react";
import { withStore, StoreState } from "@frontend/store";
import { SwatchAttributes, Shortcut, ColorState } from "@types";
import generateHash from "@generate-hash";
import { Icon } from "@frontend/components/icon";
import { dispatch } from "@frontend/action/";

const rowLength = 14;
let idList = [];
let i = -1;
const n = 64;
while (++i < n) {
  idList.push(generateHash());
}

interface ColorPaletteProps extends Pick<ColorState, "palette"> {
  onSelect: (value: string) => void;
  value: string;
}

interface ColorPaletteMappedProps extends Pick<ColorState, "palette">, ColorPaletteProps {
  isDeleteMode: boolean;
  empties: SwatchAttributes[];
  shortcut: Shortcut;
}

function mapStateToProps(
  state: StoreState,
  props: ColorPaletteProps
): ColorPaletteMappedProps {
  const empties = [];
  let i = -1;
  const length = state.color.palette.length;
  let n = rowLength - (length % rowLength);
  n = n === rowLength ? 0 : n;
  while (++i < n) {
    empties.push({
      value: null,
      id: idList[i],
      created: 0,
    });
  }
  return {
    isDeleteMode: state.shortcut === "ALT",
    shortcut: state.shortcut,
    value: props.value,
    palette: state.color.palette,
    onSelect: props.onSelect,
    empties: empties,
  };
}

function ColorPalette(props: ColorPaletteMappedProps) {
  const { isDeleteMode } = props;
  return (
    <div className="color-picker_palette">
     {props.palette.map((a) => {
        const className = [
          "color-picker_palette_swatch"
        ];

        if (a.value === props.value && !props.shortcut) {
          className.push("color-picker_palette_swatch--active");
        }

        if (isDeleteMode) {
          className.push("color-picker_palette_swatch--delete");
        }

        return (
          <div
            key={a.id}
            onClick={() => {
              if (isDeleteMode) {
                dispatch("COLOR", {
                  type: "DELETE_SWATCH",
                  id: a.id,
                });
              } else {
                props.onSelect(a.value);
              }
            }}
            className={className.join(" ")}>
            <div
              className="color-picker_palette_swatch-face"
              style={{ background: a.value }}/>
            <div className="color-picker_palette_swatch-active"/>
            <div className="color-picker_palette_swatch-stroke"/>
            {isDeleteMode
              ? (
                <div className={"color-picker_palette_swatch-delete"}>
                  <Icon type="close"/>
                </div>
              )
              : null}
          </div>
        );
     })}
     {props.empties.map((a) => {
        const className = [
          "color-picker_palette_swatch"
        ];

        return (
          <div
            key={a.id}
            className={className.join(" ")}>
            <div
              className="color-picker_palette_swatch-face"
              style={{ background: a.value }}/>
            <div className="color-picker_palette_swatch-stroke"/>
          </div>
        );
     })}
    </div>
  );
}

export const ColorPickerPaletteConnect =
  withStore<ColorPaletteProps>(ColorPalette as React.ComponentType, mapStateToProps)();