import { store, StoreState } from "@frontend/store";
import { CategoryResponse, TodoResponse } from "@types";
import { TodoEditValue } from "./types";

import ajax from "@ajax";
import _ from "lodash";
import path from "@path";

interface TodoServiceAddTodo {
  name: string;
  categoryID: string;
  tags: string[];
}

export class TodoService {
  addTodo({ name, tags, categoryID }: TodoServiceAddTodo) {
    ajax.post(`/todo/${categoryID}`, {
      data: {
        name: name,
        action: "create",
        tags,
      }
    })
      .then((newTodo: TodoResponse) => {
        const todo: StoreState["todo"] = _.merge({}, store.value.todo);

        const category = todo.categories
          .find((a) => categoryID === a.id);

        category.todos.push(newTodo);

        store.set({
          todo,
        });
      });
  }

  getTodo(categoryID: string, todoID: string) {
    const categories = store.value.todo.categories;
    const category = categories.find((a) => a.id === categoryID);
    return _.merge({}, category.todos.find((child) => child.id === todoID));
  }

  setTodoState(state: string, { idList, categoryID } : { idList: string[], categoryID: string }) {
    const categories: CategoryResponse[] = _.merge([], store.value.todo.categories);
    const prevCategories: CategoryResponse[] = _.merge([], categories);
    const category = categories.find((a) => a.id === categoryID);

    category.todos.filter((todo) => idList.indexOf(todo.id) !== -1).forEach((todo) => {
      todo.state = state;
    });

    store.set({
      todo: {
        categories,
      }
    });

    ajax.post(path.join("/todo", categoryID), {
      data: {
        action: state,
        idList,
      }
    })
      .catch((todoResponse: TodoResponse) => {
        store.set({
          todo: {
            categories: prevCategories,
          }
        });
      });
  }

  incomplete(value: { idList: string[]; categoryID: string; }) {
    this.setTodoState("incomplete", value);
  }

  complete(value: { idList: string[]; categoryID: string; }) {
    this.setTodoState("complete", value);
  }

  edit(value: TodoEditValue) {
    const categories: CategoryResponse[] = _.merge([], store.value.todo.categories);
    const category = categories.find((a) => a.id === value.categoryID);
    const prevTodos: TodoResponse[] = _.merge([], category.todos);

    value.editList.forEach((todo) => {
      const todoIndex = category.todos.findIndex((a) => a.id === todo.todoID);
      const value = _.omitBy(_.omit(todo, [ "todoID" ]), (a) => a == null && typeof a === "undefined");
      Object.assign(category.todos[todoIndex], value);
    });

    store.set({
      todo: {
        categories,
      }
    });

    ajax.post(path.join("/todo", value.categoryID), {
      data: {
        action: "edit",
        editList: value.editList,
      }
    }).catch((res) => {
      const categories: CategoryResponse[] = _.merge([], store.value.todo.categories);
      const categoryIndex = categories.findIndex((a) => a.id === value.categoryID);

      categories[categoryIndex].todos = prevTodos;

      store.set({
        todo: {
          categories,
        }
      });
    });
  }

  delete(value: { categoryID: string, idList: string[] }) {
    const { idList } = value;
    const prevCategories: CategoryResponse[] = _.merge([], store.value.todo.categories);
    const nextCategories: CategoryResponse[] = _.merge([], store.value.todo.categories);
    const category = nextCategories.find((a) => a.id === value.categoryID);

    category.todos =
      category.todos.filter((child) => idList.indexOf(child.id) === -1);

    store.set({
      todo: {
        categories: nextCategories,
      }
    });

    ajax.post(path.join("/todo", value.categoryID), {
      data: {
        action: "delete",
        idList,
      }
    }).catch(() => {
      store.set({
        todo: {
          categories: prevCategories,
        }
      });
    });
  }

  select({ id }) {
    const selected: string[] = _.merge([], store.value.todo.selected);
    selected.push(id);
    store.set({
      todo: {
        selected,
      }
    });
  }

  deselect({ id }) {
    const selected: string[] = _.merge([], store.value.todo.selected);
    selected.filter((selectedId) => selectedId !== id);
    store.set({
      todo: {
        selected,
      }
    });
  }
}
