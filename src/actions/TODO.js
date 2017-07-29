import store from "../store/";
import _ from "lodash";
import generateId from "../scripts/generateId";

store.on("ADD_TODO", ({ projectId, text }) => {
  const id = generateId();
  store.set([ "todos", id ], {
    id: id,
    isDone: false,
    projectId: projectId,
    text: text,
    created: new Date().getTime(),
  });
});

store.on("TODO_COMPLETED", ({ isComplete, id }) => {
  if (isComplete) {
    store.set([ "todos", id, "completed" ], new Date().getTime());
  }

  store.set([ "todos", id, "isDone" ], isComplete);
});

store.on("TODO_ESTIMATE", ({ value, id }) => {
  store.set([ "todos", id, "estimate" ], value);
});

store.on("TODO_DELETE", ({ id }) => {
  store.set(
    "todos",
    _.omitBy(store.todos, todo => todo.id === id)
  );
});

store.on("HIDE_TODO_DONE", ({ projectId, hide }) => {
  store.set(
    [ "projects", projectId, "hideTodoDone" ],
    hide
  );
});