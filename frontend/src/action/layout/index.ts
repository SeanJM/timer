import { store } from "@frontend/store";

export function layout(subscribe) {
  subscribe("LAYOUT", function ({ type, value }) {
    store.set({
      layout: {
        [value.target]: value.defaultWidth
      }
    });
  });
}