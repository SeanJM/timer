import { Component, el } from "flatman-client";

Component.create("Button", {
  constructor(props) {
    this.on("mount", props.onMount);
    this.on("click", props.onClick);
  },

  append(children) {
    children.forEach(child => {
      if (child.tagName === "icon") {
        this.addClass("button--has-icon");
        this.document.append([child]);
      } else if (typeof child === "string") {
        this.names.text.append([child]);
      } else {
        this.document.append([child]);
      }
    });
  },

  text(value) {
    this.names.text.text(value);
  },

  render(props) {
    const className = [ "button" ];

    if (props.className) {
      className.push(props.className);
    }

    return el("div", {
      name: props.name || "button",

      onMount: () => {
        this.trigger("mount");
      },

      onClick: () => {
        this.trigger("click");
      },

      className: className
    }, [
      el("div", {
        className: "button_face"
      }),
      el("div", {
        name: "text",
        className: "button_text"
      })
    ]);
  }
});