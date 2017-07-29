import { Component, el } from "flatman-client";

Component.create("App", {
  render() {
    return el("div", {
      className: "app"
    }, [
      el("div", {
        className: "app_content"
      }, [
        el("Projects"),
        el("TimeTracker"),
        el("TodoList")
      ])
    ]);
  }
});