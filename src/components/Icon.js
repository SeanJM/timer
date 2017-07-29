import { Component, el } from "flatman-client";

Component.create("Icon", {
  render(props) {
    const className = [ "icon", "icon-" + props.name ];

    if (props.className) {
      className.push(
        props.className
      );
    }

    return el("svg", {
      className: className
    }, [
      el("use", {
        href: "#icon-" + props.name
      })
    ]);
  }
});