import { Component, el } from "flatman-client";
import store from "../store";
import _ from "lodash";
import moment from "moment";

Component.create("Clock", {
  constructor(props) {
    this.props = {
      ...props,
      path : [ "projects", store.projectId, moment().format("YYYY_MM_DD") ]
    };

    store.on("projectId", id => {
      this.props.path = [ "projects", id, moment().format("YYYY_MM_DD") ];
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

    this.names.hours.text(
      _.padStart(hours, 2, "0")
    );

    this.names.minutes.text(
      _.padStart(minutes, 2, "0")
    );

    this.names.seconds.text(
      _.padStart(seconds % 60, 2, "0")
    );
  },

  render(props) {
    return el("div", {
      onMount: () => this.trigger("mount"),
      onDoubleclick: () => this.trigger("doubleclick"),
      name: props.name || "clock",
      className: "timer"
    }, [
      el("div", {
        name: "hours",
        className: "timer_hours"
      }, [ "00" ]),
      el("div", {
        name: "hours",
        className: "timer_seperator"
      }, [ ":" ]),
      el("div", {
        name: "minutes",
        className: "timer_minutes"
      }, [ "00" ]),
      el("div", {
        name: "hours",
        className: "timer_seperator"
      }, [ ":" ]),
      el("div", {
        name: "seconds",
        className: "timer_seconds"
      }, [ "00" ])
    ]);
  }
});