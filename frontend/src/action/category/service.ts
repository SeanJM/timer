import { store } from "@frontend/store";
import ajax from "@ajax";
import { CategoryResponse } from "@types";

export default class Service {
  setName() {
    store.set({
      categories: {
        setName: true,
      }
    });
  }

  create(e) {
    const category = {
      name: e.value,
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