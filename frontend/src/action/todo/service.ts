import { store, StoreState } from "@frontend/store";
import { CategoryResponse, TodoResponse } from "@types";
import ajax from "@ajax";
import _ from "lodash";
import path from "@path";

export default class Service {
  addTodo(e) {
    const url = "/todo/" + e.categoryID;

    ajax.post(url, {
      data: {
        name: e.value,
        action: "create",
      }
    })
      .then((newTodo: TodoResponse) => {
        const todo: StoreState["todo"] = _.merge({}, store.value.todo);
        const category = todo.categories
          .find((a) => e.categoryID === a.id);
        category.todos.push(newTodo);
        store.set({
          todo,
        });
      });
  }

  mergeTodo(categoryID: string, todoElement: TodoResponse) {
    const categories: CategoryResponse[] = _.merge([], store.value.todo.categories);
    const category = categories.find((category) => category.id === categoryID);
    const todo = category.todos.find((child) => child.id === todoElement.id);
    Object.assign(todo, todoElement);
    store.set({
      todo: {
        categories,
      }
    });
  }

  getTodo(categoryID: string, todoID: string) {
    const categories = store.value.todo.categories;
    const category = categories.find(a => a.id === categoryID);
    return _.merge({}, category.todos.find((child) => child.id === todoID));
  }

  incomplete(e) {
    ajax.post(path.join("/todo", e.categoryID, e.id), {
      data: {
        action: "incomplete",
      }
    })
      .then((todoResponse: TodoResponse) => {
        this.mergeTodo(e.categoryID, todoResponse);
      });
    }

    complete(e) {
      ajax.post(path.join("/todo", e.categoryID, e.id), {
        data: {
          action: "complete",
        }
      })
      .then((todoResponse: TodoResponse) => {
        this.mergeTodo(e.categoryID, todoResponse);
      });
  }

  edit(e) {
    const todo = this.getTodo(e.categoryID, e.todoID);
    const value = _.omit(e, ["categoryID", "todoID"]);
    Object.assign(todo, value);
    this.mergeTodo(e.categoryID, todo)
    ajax.post(path.join("/todo", e.categoryID, e.todoID), {
      data: {
        action: "edit",
        ...value
      }
    }).then((todoResponse: TodoResponse) => {
      this.mergeTodo(e.categoryID, todoResponse)
    });
  }

  delete(e) {
    ajax.post(path.join("/todo", e.categoryID, e.id), {
      data: {
        action: "delete"
      }
    }).then(() => {
      const categories: CategoryResponse[] = _.merge([], store.value.todo.categories);
      const category = categories.find(a => a.id === e.categoryID);
      category.todos = category.todos.filter((child) => child.id !== e.id);
      store.set({
        todo: {
          categories,
        }
      });
    });
  }
}
