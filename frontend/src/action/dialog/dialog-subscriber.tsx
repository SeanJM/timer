import { DialogService } from "./dialog-service";
const service = new DialogService();

export interface DialogDispatch {
  (type: "DIALOG", value: {
    type: "OPEN",
    value: {
      type: string,
      id?: string;
      [key: string]: any;
    }
  }): void;
}

export function dialog(subscriber) {
  subscriber("DIALOG", ({ type, value }) => {
    if (type === "OPEN") {
      service.open(value);
    } else if (type === "CLOSE") {
      service.close(value);
    }
  });
}