import { Component, el } from "flatman-client";

Component.create("Popout", {
  constructor(props) {
    const className = [ "popout" ];

    if (props.name) {
      className.push("popout-" + props.name);
    }

    this.popout = el("div", {
      className: className
    });
  },

  append(children) {
    this.popout.append(
      children
    );
  },

  close() {
    this.popout.remove();
  },

  open() {
    this.popout.appendTo(this.document);
  },

  render(props) {
    return el("div", {
      name: props.name || "popout"
    });
  }
});