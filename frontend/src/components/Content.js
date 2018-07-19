import el from "el";

el.create("Content", {
  render(props) {
    return el("div", {
      class: [ "content" ].concat(props.class).join(" ")
    });
  }
});