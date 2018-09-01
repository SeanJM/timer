import { store } from "@frontend/store";
import { SwatchAttributes, ColorPicker } from '@types';
import ajax from "@ajax";
import _ from "lodash";
import generateHash from "@generate-hash";

function swatchToAttributes(value: string): SwatchAttributes {
  return {
    created: new Date().getTime(),
    value: value.substring(1), // Remove the hash
    id: generateHash(),
  };
}

function attributesToSwatch(swatch: SwatchAttributes): SwatchAttributes {
  return {
    created: swatch.created,
    value: "#" + swatch.value, // Add the hash
    id: swatch.id,
  };
}

function addToPalette(value: string) {
  const swatch = swatchToAttributes(value);
  const indexOf = store.value.color.palette.findIndex(a => a.value === value);

  if (indexOf === -1) {
    store.set({
      color: {
        palette: store.value.color.palette.concat(swatch),
      }
    });

    ajax.post("/color/palette/", {
      data: {
        action: "create",
        value: swatch.value,
      }
    }).then((res: SwatchAttributes) => {
      const palette = store.value.color.palette.slice();
      const indexOf = palette.findIndex(a => a.id === swatch.id);

      palette.splice(indexOf, 1, {...res, value: "#" + res.value});

      store.set({
        color: {
          palette,
        }
      });
    });
  }
}

function getPalette() {
  ajax.get("/color/palette/").then((palette: SwatchAttributes[]) => {
    store.set({
      color: {
        palette: palette.map(attributesToSwatch),
      }
    });
  });
}

function deleteSwatch(id: string) {
  const swatchIndex = store.value.color.palette.findIndex(a => a.id === id);
  const swatch = store.value.color.palette[swatchIndex];
  const palette = store.value.color.palette.filter(a => a.id !== id);

  store.set({
    color: {
      palette,
    }
  });

  ajax.post("/color/palette/", {
    data: {
      action: "delete",
      id: id,
    }
  })
    .catch(() => {
      const undoPalette = palette.slice();
      undoPalette.splice(swatchIndex, 0, swatch);
      store.set({
        color: {
          palette: undoPalette,
        }
      });
    });
}

export default function (subscribe) {
  subscribe("COLOR", function ({ type, value, id }) {
    if (type === "ADD_TO_PALETTE") {
      addToPalette(value);
    } else if (type === "GET_PALETTE") {
      getPalette();
    } else if (type === "DELETE_SWATCH") {
      deleteSwatch(id);
    }
  });

  subscribe("COLOR_PICKER", function (e: { type: string, value?: string; id: string }) {
    const colorPickers: ColorPicker[] = _.merge([], store.value.color.colorPickers);
    const previousItem = colorPickers.find((a) => a.id === e.id);

    if (e.type === "OPEN") {
      if (previousItem) {
        previousItem.isOpen = true;
        previousItem.value =
          typeof e.value === "string"
            ? e.value
            : previousItem.value;
      } else {
        colorPickers.push({
          value: e.value || "#c18a8a",
          id: e.id,
          isOpen: true,
        });
      }
      store.set({
        color: {
          colorPickers,
        }
      });
    }
  });

  subscribe("COLOR_PICKER", function (e: { type: string, id: string, value: string }) {
    if (e.type === "CLOSE") {
      const colorPickers = _.merge([], store.value.color.colorPickers);
      const item: ColorPicker = colorPickers.find((a) => a.id === e.id);
      item.isOpen = false;
      item.value = typeof e.value === "string" ? e.value : item.value;
      store.set({
        color: {
          colorPickers,
        }
      });
    }
  });
}