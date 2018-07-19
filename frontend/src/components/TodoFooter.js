import el from "@scripts/el";
import store from "@store";

el.create("TodoFooter", {
  onMount() {

  },

  render() {
    return el("div", {
      onMount: () => this.onMount(),
      name: "todoFooter",
      class: "todo-footer"
    });
  }
});