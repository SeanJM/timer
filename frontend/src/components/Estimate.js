import el from "@scripts/el";
import store from "@store";

function getDuration(value) {
  const todos = store.todos.filter(a => a.projectId = value.projectId);
  const isDone = todos.filter(a => a.isDone);
  // Calculate the duration for each completed todo
  // find the todo which matches the todo id
  // find it's duration by subtracting the total time clocked in
  // minus the durations of the other completed todos
  console.log(isDone);
}

function normalize(value) {
  const estimate = value.estimate;
  const duration = getDuration(value);
  const $store = store.partial(["estimate", estimate]);
  const length = $store.get("length") || 0;
  const average = $store.get("duration");

  const averageDuration = (
    length
      ? average + ((average - duration) / $store.get("length"))
      : duration
  );

  $store.set("length", length + 1);
  $store.set("duration", averageDuration);
}

store.on("*", e => {
  if (/todos\.[0-9]+\.isDone$/.test(e.path) && e.value) {
    normalize(
      e.parent()
    );
  }
});

el.create("Estimate", {
  constructor() {
  },

  render(props) {
    return el("div", {
      name: props.name || "estimate",
      class: ["estimate"].concat(props.class).join(" ")
    });
  }
});