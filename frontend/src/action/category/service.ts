import { store } from "@frontend/store";
import ajax from "@ajax";
import { CategoryResponse, CategoryAllResponse } from "@types";
import path from "@path";
import _ from "lodash";

export class CategoryService {
  setName() {
    store.set({
      categories: {
        setName: true,
      }
    });
  }

  sortBy(value) {
    const categories =
      store.value.todo.categories.slice();

    const categoryIndex =
      categories.findIndex((a)=> a.id === value.categoryID);

    const prevCategoryElement: CategoryResponse =
      _.merge({}, categories[categoryIndex]);

    const nextCategoryElement: CategoryResponse =
      _.merge({}, categories[categoryIndex], {
        sortBy: value.sortBy
      });

    categories[categoryIndex] = nextCategoryElement;

    store.set({
      todo: {
        categories
      }
    });

    ajax.post(`/category/${value.categoryID}`, {
      data: {
        action: "sort",
        sortBy: value.sortBy
      }
    })
      .catch(() => {
        const categories = store.value.todo.categories.slice();
        categories[categoryIndex] = prevCategoryElement;
        store.set({
          todo: {
            categories
          }
        });
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
      .then((res: CategoryAllResponse) => {
        store.set({
          todo: {
            todoSettings: res.todoSettings,
            categories: res.categories.map((category) => {
              return {
                ...category,
                tags: category.tags.map((tag) => {
                  return {
                    ...tag,
                    color: tag.color ? "#" + tag.color : null,
                  };
                }),
              };
            }),
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
            categories: categories.filter((category) => category.id !== e.id)
          }
        });
      });
  }
}