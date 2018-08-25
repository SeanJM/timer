import { store } from "@frontend/store";

export default function (subscribe) {
  subscribe("KEYDOWN_CTRL", function () {
    store.set({
      keys: {
        control: true,
      }
    });
  });

  subscribe("KEYUP_CTRL", function () {
    store.set({
      keys: {
        control: false,
      }
    });
  });
}