import el from "@scripts/el";

el.create("Dropdown", {
  constructor(props) {
    props.container = el("div", {
      class: "dropdown_container"
    });

    document.body.addEventListener("click", () => {
      if (document.body.contains(this.props.container.node)) {
        if (this.props.clickShouldClose) {
          this.close();
          this.props.clickShouldClose = false;
        } else {
          this.props.clickShouldClose = true;
        }
      }
    });
  },

  close() {
    this.props.container.remove();
  },

  open() {
    const parentOffset = this.parentNode.offset();

    this.document.append([
      this.props.container
    ]);

    this.props.container.style({
      top: parentOffset.height * 0.85,
    });
  },

  append(children) {
    this.props.container.append(children);
  },

  render(props) {
    return el("div", {
      name: props.name || "dropdown",
      class: ["dropdown"].concat(props.class).join(" ")
    });
  }
});

el.create("DropdownItem", {
  render(props) {
    return el("div", {
      name: "dropdown-item",
      class: ["dropdown-item"].concat(props.class).join(" ")
    });
  }
});