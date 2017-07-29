import { Component, el } from "flatman-client";
import store from "../store";
import moment from "moment";
import _ from "lodash";

Component.create("Project", {
  constructor(props) {
    this.on("click", props.onClick);
    this.on("delete", props.onDelete);

    store.on("projectId", id => {
      if (this.props.id === id) {
        this.select();
      } else {
        this.deselect();
      }
    });
  },

  delete() {
    this.remove();
    store.trigger("DELETE_PROJECT", {
      id: this.props.id
    });
  },

  update() {
    const project = store.projects[this.props.id];
    this.props.name = project.name;
    this.names.name.text(this.props.name);
  },

  select() {
    this.document.addClass("project--is-focus");
  },

  deselect() {
    this.document.removeClass("project--is-focus");
  },

  onMount() {
    if (store.projectId === this.props.id) {
      this.select();
    }
  },

  onClick() {
    this.trigger("click", this.props);
  },

  onKeydown(e) {
    if (e.which === 46 || e.which === 8) {
      this.delete();
    }
  },

  render(props) {
    return el("div", {
      onClick: () => this.onClick(),
      onKeydown: (e) => this.onKeydown(e),
      onceMount: () => this.onMount(),
      tabindex: 0,
      className: "project"
    }, [
      el("Icon", {
        className: "project_folder",
        name : "folder"
      }),
      el("div", {
        name: "name",
        className: "project_name"
      }, [
        props.name
      ]),
      el("div", {
        name: "close",
        className: "project_close",
        onClick: () => this.delete()
      }, [
        el("Icon", { name: "close" })
      ]),
      el("div", { className: "project_date" }, [
        moment(props.date).format("MMM / D / YYYY — h:mmA")
      ]),
    ]);
  }
});