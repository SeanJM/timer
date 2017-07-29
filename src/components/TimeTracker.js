import { Component, el } from "flatman-client";
import _ from "lodash";
import store from "../store";
import moment from "moment";

console.log(store);

Component.create("TimeTracker", {
  constructor(props) {
    props.path = [ "projects", store.projectId, "timeTracker", moment().format("YYYY_MM_DD") ];
    this.sound = el("Sound");

    store.on("projectId", id => {
      props.path.splice(1, 1, id);
    });

    store.on("*", e => {
      const p = props.path.join(".");
      if (e.path.indexOf(p) === 0) {
        if (e.path === p + ".punchedIn") {
          if (e.value) {
            this.onPunchedIn();
          } else {
            this.onPunchedOut();
          }
        } else if (e.path === p + ".clockedInTime") {
          this.names.clock.value(e.value);
        }
      }
    });
  },

  onPunchedOut() {
    this.names.punchButton.text("Punch in");
  },

  onPunchedIn() {
    this.names.punchButton.text("Punch out");
  },

  countDown(duration) {
    const ringWhen = 60 * 1000;
    const ringAt = duration - ringWhen;
    const divisions = 4;
    while (divisions > 0) {
      setTimeout(() => {
        if (divisions > 1) {
          this.sound.play("chimes");
        } else {
          this.sound.play("glass");
        }
      }, ringAt + (ringWhen / divisions));
    }
  },

  break() {
    this.countDown(store.breakEnd);
  },

  reset() {
    store.trigger("RESET_TIMETRACKER", {
      projectId: store.projectId
    });
  },

  punchIn() {
    store.trigger("PUNCH_IN", {
      projectId: store.projectId
    });
  },

  punchOut() {
    store.trigger("PUNCH_OUT", {
      projectId: store.projectId
    });
  },

  editTime() {
    this.names.editTime.open();
    // store.trigger("TIMETRACKER_EDIT", {
    //   projectId: store.projectId
    // });
  },

  render() {
    const self = this;
    return el("div", {
      className: "time-tracker"
    }, [
      el("Clock", {
        name: "clock",
        onDoubleclick: function () {
          self.editTime();
        },
        onMount: function () {
          const clockedInTime = store.get([ self.props.path, "clockedInTime" ]);
          this.value(
            clockedInTime
          );
        }
      }, [
        el("Popout", {
          name: "editTime"
        }, [
          el("Input", {
            className: "input-hours",
            name: "editTimeHours",
            type: "text"
          }),
          el("Input", {
            className: "input-minutes",
            name: "editTimeMinutes",
            type: "text"
          }),
          el("Input", {
            className: "input-seconds",
            name: "editTimeSeconds",
            type: "text"
          }),
          el("Control", [
            el("Button", {
              onClick: () => {
                const today = moment().format("YYYY_MM_DD");
                const path = [ "projects", store.projectId, "timeTracker", today ];

                const value = {
                  hours: this.names.editTimeHours.value(),
                  minutes: this.names.editTimeHours.value(),
                  seconds: this.names.editTimeHours.value()
                };

                let time = store.get(path.concat("clockedInTime"));

                if (/^\+/.test(value.hours)) {
                  time += Number(
                    value.hours.match(/[0-9]+/)[0] * (1000 * 60 * 60)
                  );
                }

                if (/^\+/.test(value.minutes)) {
                  time += Number(
                    value.minutes.match(/[0-9]+/)[0] * (1000 * 60)
                  );
                }

                if (/^\+/.test(value.seconds)) {
                  time += Number(
                    value.seconds.match(/[0-9]+/)[0] * 1000
                  );
                }

                store.trigger("SET_TIME", {
                  projectId: store.projectId,
                  value: time
                });

                this.names.editTime.close();
              }
            }, [ "OK" ]),
            el("Button", {
              onClick: () => {
                this.names.editTime.close();
              }
            },
            [ "Cancel" ])
          ])
        ])
      ]),
      el("Control", {
        className: "time-tracker_control"
      }, [
        el("Button", {
          name: "punchButton",
          onMount: function () {
            this.on("click", () => {
              const punchedIn = store.get(self.props.path.concat("punchedIn"));
              if (punchedIn) {
                self.punchOut();
              } else {
                self.punchIn();
              }
            });
          }
        }, [ "Punch in" ]),
        el("Button", {
          onClick: () => {
            this.break();
          }
        }, [ "Break" ]),
        el("Button", {
          onClick: () => {
            this.reset();
          }
        }, [ "Reset" ]),
      ]),
      el("Log")
    ]);
  }
});