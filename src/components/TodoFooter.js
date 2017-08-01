import { Component, el } from "flatman-client";
import store from "../store/";

Component.create("TodoFooter", {
  onMount() {

  },

  render() {
    return el("div", {
      onMount: () => this.onMount(),
      name: "todoFooter",
      className: "todo-footer"
    });
  }
});