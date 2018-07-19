import el from "@scripts/el";
import store from "@store";
import _ from "lodash";
import moment from "moment";

el.create("Clock", {
  constructor(props) {
    this.props = {
      ...props,
      path: ["projects", store.projectId, moment().format("YYYY_MM_DD")]
    };

    store.on("projectId", id => {
      this.props.path = ["projects", id, moment().format("YYYY_MM_DD")];
    });

    this.on("mount", props.onMount);
    this.on("doubleclick", props.onDoubleclick);
  },

  value(milliseconds) {
    const seconds = milliseconds
      ? Math.floor(
        milliseconds / 1000
      )
      : 0;

    const hours = milliseconds
      ? Math.floor(
        seconds / 3600
      )
      : 0;

    const minutes = milliseconds
      ? Math.floor(
        (seconds / 60) % 60
      )
      : 0;

    this.refs.hours.html(
      _.padStart(hours, 2, "0")
    );

    this.refs.minutes.html(
      _.padStart(minutes, 2, "0")
    );

    this.refs.seconds.html(
      _.padStart(seconds % 60, 2, "0")
    );
  },

  render(props) {
    return el("div", {
      onMount: () => this.trigger("mount"),
      onDoubleclick: () => this.trigger("doubleclick"),
      ref: props.ref || "clock",
      class: "timer"
    }, [
        el("div", {
          ref: "hours",
          class: "timer_hours"
        }, ["00"]),
        el("div", {
          class: "timer_seperator"
        }, [":"]),
        el("div", {
          ref: "minutes",
          class: "timer_minutes"
        }, ["00"]),
        el("div", {
          class: "timer_seperator"
        }, [":"]),
        el("div", {
          ref: "seconds",
          class: "timer_seconds"
        }, ["00"])
      ]);
  }
});