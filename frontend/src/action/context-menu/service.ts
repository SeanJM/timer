import { store } from "@frontend/store";

export class ContextMenuService {
  open(value) {
    const menuID = store.value.contextMenu.find((id) => id === value.id);

    if (!menuID) {
      store.value.contextMenu.push(value.id);
    }

    store.set({
      contextMenu: store.value.contextMenu,
    });
  }

  close(value) {
    store.set({
      contextMenu: store.value.contextMenu.filter((id) => id !== value.id),
    });
  }
}