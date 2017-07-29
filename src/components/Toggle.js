import { Component, el } from "flatman-client";

Component.create("Toggle", {
  constructor(props) {
    this.on("click", props.onClick);
    this.on("mount", props.onMount);
  },

  onClick() {
    this.names.checkbox.toggle();
    this.trigger("click", {
      checked: this.names.checkbox.props.checked
    });
  },

  onMount() {
    this.trigger("mount");
  },

  check() {
    this.names.checkbox.check();
  },

  append(children) {
    this.names.text.append(children);
  },

  render(props) {
    return el("div", {
      onClick: () => this.onClick(),
      onMount: () => this.onMount(),
      className: [ "toggle" ].concat(props.className)
    }, [
      el("Checkbox", {
        name: "checkbox"
      }),
      el("div", {
        name: "text",
        className: "toggle_text"
      })
    ]);
  }
});