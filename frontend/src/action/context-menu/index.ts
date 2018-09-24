import { ContextMenuService } from "./service";

const service = new ContextMenuService();

export function contextMenu(subscribe) {
  subscribe("CONTEXT_MENU", function ({ type, value }) {
    switch (type) {
      case "OPEN": {
        service.open(value);
        break;
      }
      case "CLOSE": {
        service.close(value);
      }
    }
  });
}