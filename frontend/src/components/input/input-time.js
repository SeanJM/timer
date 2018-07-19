import el from "@scripts/el";

el.create("Input.Time", {
  getValue() {
    const hours = (Number(this.names.hours.value()) || 0) * 1000 * 60 * 60;
    const minutes = (Number(this.names.minutes.value()) || 0) * 1000 * 60;
    const seconds = (Number(this.names.seconds.value()) || 0) * 1000;
    return hours + minutes + seconds;
  },

  setValue(maybeValue) {
    const value = (
      typeof maybeValue === "number"
        ? maybeValue
        : typeof maybeValue === "string"
          ? Number(maybeValue)
          : 0
    );

    const hours = Math.floor(value / (1000 * 60 * 60));
    const minutes = Math.floor(value / (1000 * 60)) % 60;
    const seconds = Math.floor(value / 1000) % 60;

    this.names.hours.value(hours);
    this.names.minutes.value(minutes);
    this.names.seconds.value(seconds);
  },

  value(value) {
    if (typeof value !== "undefined") {
      this.setValue(value);
      return this;
    }
    return this.getValue();
  },

  render(props) {
    return el("div", {
      class: "input-time",
      name: props.name || "inputTime"
    }, [
        el("Input", {
          class: "input-hours",
          name: "hours",
          type: "text"
        }),
        el("div", {
          class: "input-time_separator"
        }, [":"]),
        el("Input", {
          class: "input-minutes",
          name: "minutes",
          type: "text"
        }),
        el("div", {
          class: "input-time_separator"
        }, [":"]),
        el("Input", {
          class: "input-seconds",
          name: "seconds",
          type: "text"
        })
      ]);
  }
});