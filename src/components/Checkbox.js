import { Component, el } from "flatman-client";

Component.create("Checkbox", {
  constructor(props) {
    if (props.checked) {
      this.checked = true;
    }
  },

  check() {
    this.document.addClass("checkbox--is-checked");
    this.props.checked = true;
  },

  uncheck() {
    this.document.removeClass("checkbox--is-checked");
    this.props.checked = false;
  },

  toggle() {
    if (this.props.checked) {
      this.uncheck();
    } else {
      this.check();
    }
  },

  render(props) {
    const className = [ "checkbox" ];

    if (props.checked) {
      className.push("checkbox--is-checked");
    }

    return el("div", {
      name: "checkbox",
      className: [ "checkbox" ].concat(props.className)
    }, [
      el("div", {
        className: "checkbox_shadow"
      }),
      el("div", {
        className: "checkbox_background"
      }),
      el("Icon", {
        className: "checkbox_indicator",
        name: "check"
      })
    ]);
  }
});