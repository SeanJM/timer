import { store, StoreAlert } from "@store";
import generateHash from "@generate-hash";

export class AlertService {
  push(alert: StoreAlert) {
    if (!alert.id) {
      alert.id = generateHash();
    }

    store.set({
      alerts: store.value.alerts.concat(alert)
    });
  }

  pop(alert: Pick<StoreAlert, "id">) {
    store.set({
      alerts: store.value.alerts.filter((a) => a.id !== alert.id)
    });
  }
}