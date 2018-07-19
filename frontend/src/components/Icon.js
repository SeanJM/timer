import el from "@scripts/el";

el.create("Icon", {
  render(props) {
    const className = ["icon", "icon-" + props.name];

    if (props.class) {
      className.push(
        props.class
      );
    }

    return el("svg", {
      class: className.join(" ")
    }, [
        el("use", {
          href: "#icon-" + props.name
        })
      ]);
  }
});