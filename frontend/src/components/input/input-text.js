import el from "@scripts/el";

el.create("Input.text", {
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

  onMount() {
    if (this.props.hasButton) {
      this.refs.input.style({
        paddingRight: this.refs.button.offset().width * 1.2
      });
    }
  },

  focus() {
    this.refs.input.focus();
  },

  value(t) {
    console.log("value");
    if (typeof t === "string") {
      this.refs.input.value(t);
      return this;
    }

    return this.refs.input.value();
  },

  render(props) {
    return el("div", {
      class: ["input"].concat(props.className).join(" ")
    }, [
        el("input", {
          onFocus: e => this.trigger("focus", e),
          onBlur: e => this.trigger("blur", e),
          onMount: () => this.onMount(),
          onKeydown: e => this.trigger("keydown", e),
          tabIndex: 0,
          ref: "input",
          type: props.type
        })
      ]);
  }
});