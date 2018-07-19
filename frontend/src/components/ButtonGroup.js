import el from "@scripts/el";

el.create("ButtonGroup", {
  select(child) {
    this.props.value = child.props.value;

    this.document.childNodes.forEach(c => {
      if (child !== c) {
        c.removeClass("button-group_button--is-selected");
      }
    });

    child.addClass("button-group_button--is-selected");
  },

  value(t) {
    if (typeof t !== "undefined") {
      this.props.value = t.toString();
      this.document.childNodes.forEach(child => {
        if (child.props.value === this.props.value) {
          this.select(child);
        }
      });

      return this;
    }

    return this.props.value;
  },

  append(children) {
    const width = 100 / children.length;

    children.forEach(child => {
      child.on("click", () => {
        this.select(child);
        this.trigger("click", {
          value: child.props.value
        });
      });

      if (this.props.value === child.props.value) {
        this.select(child);
      }

      child.style({
        width: width + "%"
      });
    });

    this.document.append(children);
  },

  render(props) {
    const className = ["button-group"];

    if (props.className) {
      className.push(props.className);
    }

    return el("div", {
      name: props.name || "button-group",
      class: className.join(" ")
    });
  }
});