import { store } from "@store";
import generateId from "@generate-id";

export class DialogService {
  open(value) {
    const { dialogs } = store.value;
    const contains = dialogs.find((dialog) => dialog.id === value.id);
    if (!contains) {
      store.set({
        dialogs: dialogs.concat({
          id: generateId(),
          ...value
        })
      });
    }
  }

  close({ id }) {
    store.set({
      dialogs: store.value.dialogs.filter((dialog) => dialog.id !== id),
    });
  }
}