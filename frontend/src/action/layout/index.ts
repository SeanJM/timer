import { store } from "@frontend/store";

export function layout(subscribe) {
  subscribe("LAYOUT", function ({ type, value }) {
    store.set({
      layout: {
        todoEditorDefaultWidth: value.defaultWidth
      }
    });
  });
}