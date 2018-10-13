import { store, StoreAlert } from "@store";

export class AlertService {
  push(alert: StoreAlert) {
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