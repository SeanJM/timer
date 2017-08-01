import { Component, el } from "flatman-client";

Component.create("Input.text", {
  constructor(props) {
    this.on("keydown", props.onKeydown);
  },

  append(children) {
    for (var i = 0, n = children.length; i < n; i++) {
      if (children[i].tagName === "Icon") {
        this.props.hasIcon = true;
        children[i].addClass("input_icon");
        this.addClass("input--has-icon");
      } else if (children[i].tagName === "Button") {
        this.props.hasButton = true;
        this.names.button = children[i];
        this.addClass("input--has-button");
      }
    }
    this.document.append(children);
  },

  onMount() {
    if (this.props.hasButton) {
      this.names.input.style({
        paddingRight: this.names.button.offset().width * 1.2
      });
    }
  },

  value(t) {
    if (typeof t === "string") {
      this.names.input.value(t);
      return this;
    }

    return this.names.input.value();
  },

  render(props) {
    return el("div", {
      name: props.name,
      className: [ "input" ].concat(props.className)
    }, [
      el("input", {
        onFocus: e => this.trigger("focus", e),
        onBlur:  e => this.trigger("blur", e),
        onMount: () => this.onMount(),
        onKeydown: e => this.trigger("keydown", e),
        name: "input",
        type: props.type
      })
    ]);
  }
});