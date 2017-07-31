import { Component, el } from "flatman-client";
import store from "../store/";
import moment from "moment";

Component.create("Todo", {
  constructor(props) {
    this.on("estimate", props.onDifficulty);

    store.on(/^todos\.([a-zA-Z0-9]+)/, e => {
      if (e.match[1] === this.props.id) {
        this.onTodo(e);
      }
    });

    store.on(/^projects\.([a-zA-Z0-9]+)\.hideTodoDone$/, e => {
      if (
        e.match[1] === this.props.projectId &&
        store.todos[this.props.id]
      ) {
        this.hideDone();
      }
    });
  },

  onTodo(e) {
    if (/isDone$/.test(e.path)) {
      this.isDone(e.value);
    } else if (/estimate$/.test(e.path)) {
      this.names.estimateText.text(e.value);
      this.names.estimatePopout.close();
    }
  },

  onMount() {
    this.isDone(this.props.isDone);
    this.hideDone();
  },

  hideDone() {
    const todo = store.todos[this.props.id];
    const isHidden = store.get(["projects", this.props.projectId, "hideTodoDone"]);
    this.document.style({
      display: isHidden && todo.isDone
        ? "none"
        : ""
    });
  },

  isDone(bool) {
    if (bool) {
      this.addClass("todo--is-done");
    } else {
      this.removeClass("todo--is-done");
    }
    this.hideDone();
  },

  onDone() {
    store.trigger("TODO_COMPLETED", {
      id: this.props.id,
      isComplete: this.names.done.isChecked()
    });
  },

  delete() {
    this.remove();
    store.trigger("TODO_DELETE", {
      id: this.props.id
    });
  },

  setEstimate(value)  {
    store.trigger("TODO_ESTIMATE", {
      value: value,
      id: this.props.id
    });
  },

  append(children) {
    this.names.text.text(children[0]);
  },

  render(props) {
    const className = ["todo"];

    return el("div", {
      className: className.join(" "),
      onMount: () => this.onMount()
    }, [
      el("div", {
        name: "text",
        className: "todo_text"
      }),
      el("div", {
        name: "text",
        className: "todo_date"
      }, [
        moment(
          new Date(this.props.created)
        )
          .format("MM/DD/YYYY - h:mmA")
      ]),
      el("div", {
        className: "todo_close",
        onClick: () => this.delete()
      }, [
        el("Icon", { name: "close" })
      ]),
      el("div", {
        name: "estimate",
        className: "todo_estimate",
        onClick: () => {
          this.names.estimatePopout.open();
        }
      }, [
        el("div", {
          name: "estimateText"
        }, [
          this.props.estimate || "0",
        ]),
        el("Popout", {
          name: "estimatePopout"
        }, [
          el("Input", {
            type: "slider",
            size: 5,
            value: this.props.estimate,
            onInput: e => this.setEstimate(e.value)
          })
        ]),
      ]),
      el("input", {
        type: "checkbox",
        name: "done",
        className: "todo_done",
        onClick: () => this.onDone(),
        onMount: function () {
          if (props.isDone) {
            this.check();
          }
        }
      })
    ]);
  }
});