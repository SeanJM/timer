import el from "@scripts/el";

el.create("Popout", {
  constructor(props) {
    const className = ["popout"];

    if (props.name) {
      className.push("popout-" + props.name);
    }

    this.popout = el("div", {
      class: className.join(" ")
    });
  },

  append(children) {
    this.popout.append(
      children
    );
  },

  close() {
    this.popout.remove();
  },

  open() {
    this.popout.appendTo(this.document);
    this.popout.childNodes.forEach(child => child.trigger("open"));
  },

  render(props) {
    return el("div", {
      name: props.name || "popout"
    });
  }
});