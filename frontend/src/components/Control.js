import el from "@scripts/el";

el.create("Control", {
  render(props) {
    return el("div", {
      class: ["control"].concat(props.class).join(" ")
    });
  }
});