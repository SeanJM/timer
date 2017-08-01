import { Component, el } from "flatman-client";

Component.create("Content", {
  append(children) {
    const head = [];
    const body = [];

    for (var i = 0, n = children.length; i < n; i++) {
      if (children[i].tagName === "Titlebar") {
        head.push(children[i]);
      } else {
        body.push(children[i]);
      }
    }

    this.names.head.append(head);
    this.names.body.append(body);
  },

  render(props) {
    return el("div", {
      name: props.name || "content",
      className: [ "content" ].concat(props.className)
    }, [
      el("div", { name: "head", className: "content_head" }),
      el("div", { name: "body", className: "content_body" })
    ]);
  }
});