import el from "@scripts/el";

el.create("Checkbox", {
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
    const className = ["checkbox"];

    if (props.checked) {
      className.push("checkbox--is-checked");
    }

    return el("div", {
      name: "checkbox",
      class: ["checkbox"].concat(props.class).join(" ")
    }, [
        el("div", {
          class: "checkbox_shadow"
        }),
        el("div", {
          class: "checkbox_background"
        }),
        el("Icon", {
          class: "checkbox_indicator",
          name: "check"
        })
      ]);
  }
});