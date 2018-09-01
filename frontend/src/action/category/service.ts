import { store } from "@frontend/store";
import ajax from "@ajax";
import { CategoryResponse } from "@types";
import path from "@path";

export default class Service {
  setName() {
    store.set({
      categories: {
        setName: true,
      }
    });
  }

  getAll() {
    store.set({
      todo: {
        isRequest: true,
        isSuccess: null,
      }
    });

    ajax.get("/category/all")
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

  create(e) {
    store.set({
      todo: {
        isRequest: true,
        isSuccess: null
      }
    });

    ajax.post("/category", {
      data: {
        action: "create",
        name: e.value,
      }
    })
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

  delete(e) {
    ajax.post(path.join("/category", e.id), {
      data: {
        action: "delete",
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
}