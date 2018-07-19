import el from "el";

el.create("Close", {
  constructor(props) {
    this.on("click", props.onClick);
  },

  render() {
    return el("div", {
      class : "close",
      onClick: () => this.trigger("click")
    }, [
      el("Icon", { name: "close" })
    ]);
  }
});