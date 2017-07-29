import { Component, el } from "flatman-client";

Component.create("Input", {
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

  onFocus() {
    this.addClass("input--is-focus");
  },

  onBlur() {
    this.removeClass("input--is-focus");
  },

  onKeydown(e) {
    this.trigger("keydown", e);
  },

  value(t) {
    if (typeof t === "string") {
      this.names.input.value(t);
      return this;
    }

    return this.names.input.value();
  },

  render(props) {
    return el("Input." + props.type, {
      ...props,
      onFocus: () => this.onFocus(),
      onBlur: () => this.onBlur(),
      onMount: () => this.onMount(),
      onKeydown: (e) => this.onKeydown(e),
    });
  }
});