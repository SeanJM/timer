import { Component, el } from "flatman-client";
import store from "../store/";

Component.create("TodoList", {
  constructor() {
    this.todos = {};

    store.on("projectId", () => {
      this.names.items.html("");
      this.todos = {};
      this.update();
    });

    store.on("*", (e) => {
      if (/^todos\.[a-zA-Z0-9]+$/.test(e.path)) {
        this.update();
      }
    });
  },

  update() {
    for (var id in store.todos) {
      if (store.todos[id].projectId === store.projectId) {
        if (!this.todos[id]) {
          this.todos[id] = el("Todo",
            store.todos[id],
            [ store.todos[id].text ]
          );
          this.names.items.append([
            this.todos[id]
          ]);
        }
      }
    }

  },

  addTodo() {
    const value = this.names.text.value();
    if (value.length) {
      this.names.text.value("");
      store.trigger("ADD_TODO", {
        projectId: store.projectId,
        text: value
      });
    }
  },

  toggleDone(e) {
    store.trigger("HIDE_TODO_DONE", {
      projectId: store.projectId,
      hide: e.checked
    });
  },

  onMount() {
    this.update();
  },

  onKeydown(e) {
    // Enter key
    if (e.which === 13) {
      this.addTodo();
    }
  },

  onFilter() {
    this.names.filterDropdown.open();
  },

  render() {
    return el("div", {
      onceMount: () => this.onMount(),
      name: "todo-list",
      className: "todo-list"
    }, [
      el("div", {
        className: "todo-list_content"
      }, [
        el("Estimate"),
        el("div", {
          name: "create",
          className: "todo-list_create"
        }, [
          el("Input", {
            type: "text",
            className: "todo-list_input",
            name: "text",
            onKeydown: e => this.onKeydown(e),
          }, [
            el("Button", {
              onClick: e => this.addTodo(e),
              className: "todo-list_button-add",
              name: "add"
            }, [
              el("Icon", { name: "add" })
            ])
          ]),
        ]),
        el("div", {
          className: "todo-list_header"
        }, [
          el("div", {
            className: "todo-list_header_filters",
            onClick: () => this.onFilter()
          }, [
            el("Dropdown", {
              name: "filterDropdown"
            }, [
              el("DropdownItem", [
                el("Toggle", {
                  onMount: function () {
                    const hideTodoDone = store.get([
                      "projects", store.projectId, "hideTodoDone"
                    ]);

                    if (hideTodoDone) {
                      this.check();
                    } else {
                      this.uncheck();
                    }
                  },
                  onClick: (e) => this.toggleDone(e)
                }, [
                  "Hide done"
                ])
              ])
            ]),
            el("Icon", {
              name: "filter"
            })
          ]),
          el("div", {
            className: "todo-list_header_estimate"
          }, [
            "Est."
          ]),
          el("div", {
            className: "todo-list_header_title"
          }, [
            "Title"
          ])
        ]),
        el("div", {
          name: "items",
          className: "todo-list_items"
        })
      ])
    ]);
  }
});