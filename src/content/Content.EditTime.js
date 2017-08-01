import { Component, el } from "flatman-client";

Component.create("Content.EditTime", {
  constructor(props) {
    this.on("submit", props.onSubmit);
    this.on("cancel", props.onCancel);
    this.on("open", props.onOpen);
  },

  value(int) {
    this.names.time.value(int);
  },

  render(props) {
    return el("Content", [
      el("Titlebar", [
        el("ButtonGroup", {
          name: "type",
          value: (
            props.type ||
            "add"
          )
        }, [
          el("Button", { value: "add" }, [ "Add" ]),
          el("Button", { value: "subtract" }, [ "Subtract" ])
        ])
      ]),
      el("Input.Time", {
        name: "time"
      }),
      el("Control", [
        el("Button", {
          onClick: () => {
            this.trigger("submit", {
              time: this.names.time.value(),
              type: this.names.type.value()
            });
          }
        }, [ "OK" ]),
        el("Button", {
          onClick: () => {
            this.trigger("cancel");
          }
        },
        [ "Cancel" ])
      ])
    ]);
  }
});