import { store, Category, StoreState, TodoNode } from "@frontend/store";
import { CategoryResponse, TodoResponse } from "@types";
import ajax from "@ajax";
import _ from "lodash";

export default class Service {
  getCategories() {
    store.set({
      todo: {
        isRequest: true,
        isSuccess: null,
      }
    });
    ajax.get("/todo/category/all")
      .then((categories: CategoryResponse[]) => {
        store.set({
          todo: {
            categories: categories,
            isRequest: false,
            isSuccess: true,
          }
        });
      })
      .catch(() => {
        store.set({
          todo: {
            isRequest: false,
            isSuccess: false,
          }
        });
      });
  }

  deleteCategory(e) {
    ajax.delete("/todo/category", {
      data: {
        id: e.id,
      }
    })
      .then(() => {
        const { categories } = store.value.todo;
        store.set({
          todo: {
            categories: categories.filter(category => category.id !== e.id)
          }
        })
      });
  }

  addTodo(e) {
    const url = "/todo/category/" + e.categoryID;

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

  mergeTodo(categoryID: string, todoElement: TodoNode) {
    const categories = _.merge([], store.value.todo.categories);
    const category: Category = categories.find(a => a.attributes.id === categoryID);
    const todo = category.children.find((child: TodoNode) => child.attributes.id === todoElement.attributes.id);
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
    ajax.post("/todo/category/" + e.categoryID, {
      data: {
        id: e.id,
        action: "incomplete",
      }
    })
      .then((todoResponse: TodoNode) => {
        this.mergeTodo(e.categoryID, todoResponse);
      });
    }

    complete(e) {
      ajax.post("/todo/category/" + e.categoryID, {
        data: {
          id: e.id,
          action: "complete",
        }
      })
      .then((todoResponse: TodoNode) => {
        this.mergeTodo(e.categoryID, todoResponse);
      });
  }

  delete(e) {
    ajax.post("/todo/category/" + e.categoryID, {
      data: {
        id: e.id,
        action: "delete"
      }
    }).then(() => {
      const categories = _.merge([], store.value.todo.categories);
      const category: Category = categories.find(a => a.attributes.id === e.categoryID);
      category.children = category.children.filter((child: TodoNode) => child.attributes.id !== e.id);
      store.set({
        todo: {
          categories,
        }
      });
    });
  }

  addCategory(e) {
    const category = {
      name: e.name,
    };

    store.set({
      todo: {
        isRequest: true,
        isSuccess: null
      }
    });

    ajax.post("/todo/category", { data: category })
      .then((res: CategoryResponse) => {
        store.set({
          todo: {
            categories: store.value.todo.categories.concat(res),
            isRequest: false,
            isSuccess: true,
          }
        });
      })
      .catch(() => {
        store.set({
          todo: {
            isRequest: false,
            isSuccess: false,
          }
        });
      });
  }
}
