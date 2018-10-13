import { AlertService } from "./service";
const service = new AlertService();

export function alert(subscribe) {
  subscribe("ALERT", function (e) {
    switch (e.type) {
      case "PUSH": {
        service.push(e.value);
        break;
      }

      case "POP": {
        service.pop(e.value);
      }
    }
  });
}