import el from "@scripts/el";

el.create("Toggle", {
  constructor(props) {
    this.on("click", props.onClick);
    this.on("mount", props.onMount);
  },

  onClick() {
    this.refs.checkbox.toggle();
    this.trigger("click", {
      checked: this.refs.checkbox.props.checked
    });
  },

  onMount() {
    this.trigger("mount");
  },

  check() {
    this.refs.checkbox.check();
  },

  append(children) {
    this.refs.text.append(children);
  },

  render(props) {
    return el("div", {
      onClick: () => this.onClick(),
      onMount: () => this.onMount(),
      class: ["toggle"].concat(props.class).join(" ")
    }, [
        el("Checkbox", {
          ref: "checkbox"
        }),
        el("div", {
          ref: "text",
          class: "toggle_text"
        })
      ]);
  }
});