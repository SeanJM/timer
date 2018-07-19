import el from "el";
import store from "store";
import moment from "moment";
import _ from "lodash";

el.create("Project", {
  constructor(props) {
    this.on("click", props.onClick);
  },

  select() {
    this.node.addClass("project--selected");
  },

  deselect() {
    this.node.removeClass("project--selected");
  },

  render(props) {
    return el("div", {
      tabindex: 0,
      class: "project",
      onClick: () => this.trigger("click")
    }, [
      el("Icon", {
        class: "project_folder",
        name : "folder"
      }),
      el("div", {
        name  : "name",
        class : "project_name"
      }, [
        props.value
      ]),
      el("div", {
        name: "close",
        class: "project_close",
        onClick: () => this.delete()
      }, [
        el("Icon", { name: "close" })
      ]),
      el("div", { class: "project_date" }, [
        moment(props.date).format("MMM / D / YYYY — h:mmA")
      ]),
    ]);
  }
});