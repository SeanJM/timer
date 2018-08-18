import { store, StoreState } from "@store";

export default function (subscribe) {
  subscribe("OPEN_SLIDEOUT", function (e) {
    store.set({
      slideOut: {
        type: e.type,
        value: e.value
      } as StoreState["slideOut"]
    });
  });

  subscribe("CLOSE_SLIDEOUT", function () {
    store.set({
      slideOut: {
        type: null,
        value: null
      } as StoreState["slideOut"]
    });
  });
}