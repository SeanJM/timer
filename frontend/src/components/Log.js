import el from "@scripts/el";
import store from "@store";
import _ from "lodash";

el.create("Log", {
  constructor() {
    store.on("clockIn, clockOut", () => {
      var logContent = el("div");
      var clockIn = store.clockIn;
      var clockOut = store.clockOut;

      for (var i = 0, n = clockIn.length; i < n; i++) {
        logContent.append([
          el("div", {
            class: "log_time log_time-clock-in"
          }, [
              el("div", {
                class: "log_time_title"
              }, ["Clock in"]),
              el("div", {
                class: "log_time_value"
              }, [this.formatTime(clockIn[i])])
            ])
        ]);

        if (clockOut[i]) {
          logContent.append([
            el("div", {
              class: "log_time log_time-clock-out"
            }, [
                el("div", {
                  class: "log_time_title"
                }, ["Clock out"]),
                el("div", {
                  class: "log_time_value"
                }, [this.formatTime(clockOut[i])])
              ])
          ]);
        }
      }

      this.document.html("");
      this.document.append(logContent.childNodes);
    });
  },

  formatTime(a) {
    var d = new Date(a);
    var h = _.padStart(d.getHours(), 2, "0");
    var m = _.padStart(d.getMinutes(), 2, "0");
    var s = _.padStart(d.getSeconds(), 2, "0");
    return h + ":" + m + ":" + s;
  },

  render() {
    return el("div", {
      class: "log"
    });
  }
});