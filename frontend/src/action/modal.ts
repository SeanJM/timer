import { store } from "@frontend/store";

export default function (subscribe) {
  subscribe("MODAL_OPEN", function (e) {
    store.set({
      modal: {
        name: e.name,
        value: e.value
      }
    });
  });

  subscribe("MODAL_CLOSE", function () {
    store.set({
      modal: {
        name: null,
        value: null
      }
    });
  });
}