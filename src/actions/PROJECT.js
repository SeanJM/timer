import store from "../store/";
import _ from "lodash";
import generateId from "../scripts/generateId";

import "./TIMETRACKER";

store.on("DELETE_PROJECT", ({ id }) => {
  const keys = Object.keys(store.projects);

  const todos = store.todos
    .filter(todo => todo.projectId !== id);

  const projects = _.omitBy(store.projects, (a, pId) => pId === id);

  let nextProjectId = store.projectId;

  if (store.projectId === id) {
    if (keys.indexOf(id) > 0) {
      nextProjectId = keys[keys.indexOf(id) - 1];
    } else if (keys.length > 1) {
      nextProjectId = keys[1];
    }
  }

  store.set("projectId", nextProjectId);
  store.set("projects", projects);
  store.set("todos", todos);
});

store.on("ADD_PROJECT", ({ name }) => {
  const id = generateId();

  store.set([ "projects", id ], {
    timeTracker: {},
    name: name,
    date: new Date().getTime(),
    id: id,
    hideTodoDone: false
  });

  store.set("projectId", id);
});

store.on("SELECT_PROJECT", ({ value }) => {
  store.set("projectId", value);
});