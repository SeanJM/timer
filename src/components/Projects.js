import { Component, el } from "flatman-client";
import store from "../store";

Component.create("Projects", {
  constructor() {
    store.on(/^projects/, () => {
      this.update();
    });
  },

  onClick(e) {
    store.trigger("SELECT_PROJECT", {
      value: e.id
    });
  },

  update() {
    for (var k in store.projects) {
      if (this.names[k]) {
        this.names[k].update();
      } else {
        this.names[k] = el("Project",
          Object.assign({
            onClick: e => this.onClick(e)
          },
          store.projects[k]
          )
        );
        this.names.list.append([
          this.names[k]
        ]);
      }
    }
  },

  addProject() {
    store.trigger("ADD_PROJECT", {
      name: this.names.project.value()
    });
    this.names.project.value("");
  },

  onKeydown(e) {
    if (e.which === 13) {
      this.addProject();
    }
  },

  render() {
    return el("div", {
      onMount: () => this.update(),
      className: "projects"
    }, [
      el("div", {
        className: "projects_name"
      }, [
        el("Input", {
          type: "text",
          name: "project",
          onKeydown: (e) => this.onKeydown(e)
        }, [
          el("Icon", {
            name: "folder-add"
          }),
          el("Button", {
            className: "projects_add"
          }, [
            el("Icon", {
              name: "add"
            })
          ])
        ]),
      ]),
      el("div", {
        name: "list",
        className: "projects_list"
      })
    ]);
  }
});