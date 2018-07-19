import el from "@scripts/el";

el.create("Input", {
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
        this.refs.button = children[i];
        this.addClass("input--has-button");
      }
    }
    this.node.append(children);
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

  focus() {
    setTimeout(() => {
      this.node.focus();
    }, 0);
  },

  value(t) {
    if (typeof t === "string" || typeof t === "number") {
      this.refs.input.value(t.toString());
      return this;
    }

    return this.refs.input.value();
  },

  render(props) {
    return el("Input." + props.type, {
      ...props,
      ref: "input",
      onFocus: () => this.onFocus(),
      onBlur: () => this.onBlur(),
      onMount: () => this.onMount(),
      onKeydown: (e) => this.onKeydown(e),
    });
  }
});