import { Component, el } from 'flatman-client';

Component.create("Control", {
  render(props) {
    return el("div", {
      name: props.name || "control",
      className: ["control"].concat(props.className)
    });
  }
});