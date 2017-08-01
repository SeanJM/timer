import { Component, el } from "flatman-client";

Component.create("Titlebar", {
  render(props) {
    return el("div", {
      className: ["titlebar"].concat(props.className)
    });
  }
});