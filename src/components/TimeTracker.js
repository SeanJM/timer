import { Component, el } from "flatman-client";
import store from "../store";
import moment from "moment";

console.log(store);

Component.create("TimeTracker", {
  constructor(props) {
    const today = moment().format("YYYY_MM_DD");

    props.path = [ "projects", store.projectId, "timeTracker", moment().format("YYYY_MM_DD") ];
    this.sound = el("Sound");

    store.on("projectId", id => {
      props.path.splice(1, 1, id);
    });

    store.on(new RegExp("projects\\.([a-zA-Z0-9]+)\\.timeTracker\\." + today + "\\.([a-zA-Z0-9]+)"), e => {
      if (e.match[1] === store.projectId) {
        if (e.match[2] === "punchedIn") {
          if (e.value) {
            this.onPunchedIn();
          } else {
            this.onPunchedOut();
          }
        } else if (e.match[2] === "clockedInTime") {
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
  },

  render() {
    const self = this;
    const today = moment().format("YYYY_MM_DD");
    return el("div", {
      className: "time-tracker",
      onMount: () => {
        this.names.clock.value(
          store.get([ self.props.path, "clockedInTime" ])
        );
      }
    }, [
      el("Clock", {
        name: "clock",
        onDoubleclick: function () {
          self.editTime();
        }
      }, [
        el("Popout", {
          name: "editTime"
        }, [
          el("Content.EditTime", {
            onOpen: function () {
              const value = (
                store.get([ "projects", store.projectId, "timeTracker", today, "timeOffset", "value" ]) ||
                0
              );
              this.value(value);
            },
            onCancel: () => {
              this.names.editTime.close();
            },
            onSubmit: ({ time, type }) => {
              store.trigger("OFFSET_TIME", {
                projectId: store.projectId,
                value: time,
                type: type
              });

              this.names.editTime.close();
            },
            type: store.get([ "projects", store.projectId, "timeTracker", today, "timeOffset", "type" ])
          })
        ])
      ]),
      el("Control", {
        className: "time-tracker_control"
      }, [
        el("Button", {
          name: "punchButton",
          onClick: () => {
            const punchedIn = store.get(
              this.props.path.concat("punchedIn")
            );

            if (punchedIn) {
              this.punchOut();
            } else {
              this.punchIn();
            }
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