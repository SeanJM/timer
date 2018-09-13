import ajax from "@ajax";
import { store } from "@frontend/store";
import { TagResponse, CategoryResponse } from "@types";
import { replaceById } from "@replace-by-id";
import path from "@path";
import generateHash from "@generate-hash";
import _ from "lodash";

export interface TagEditValue {
  categoryID: string;
  id: string;
  name: string;
  color: string;
}

export class Service {
  createTag(e) {
    const categories: CategoryResponse[] = _.merge([], store.value.todo.categories);
    const category = categories.find((a) => a.id === e.categoryID);

    const nextTag: TagResponse = {
      created: new Date().getTime(),
      name: e.name,
      color: e.color,
      id: generateHash(),
    };

    category.tags.push(nextTag);

    store.set({
      todo: {
        categories,
      }
    });

    ajax.post(path.join("/tags/", e.categoryID), {
      data: {
        action: "create",
        color: e.color ? e.color.substring(1) : null,
        name: e.name,
      } as Pick<TagResponse, "color" | "name">
    })
      .then(function (tag: TagResponse) {
        const categories: CategoryResponse[] = _.merge([], store.value.todo.categories);
        const category = categories.find((a) => a.id === e.categoryID);
        replaceById(category.tags, { ...tag, color: "#" + tag.color }, nextTag);
        store.set({
          todo: {
            categories,
          }
        });
      });
  }

  edit(value: TagEditValue) {
    const categories: CategoryResponse[] = _.merge(store.value.todo.categories);
    const category = categories.find((a) => a.id === value.categoryID);
    const prevTagIndex = category.tags.findIndex((a) => a.id === value.id);
    const prevTag = _.merge({}, category.tags[prevTagIndex]);

    const nextTag: TagResponse =
      _.merge({}, category.tags[prevTagIndex], {
        color: value.color,
        id: value.id,
        name: value.name,
      });

    category.tags.splice(prevTagIndex, 1, nextTag);

    store.set({
      todo: {
        categories
      }
    });

    ajax.post(path.join("/tags/", value.categoryID), {
      data: {
        action: "edit",
        color: value.color.replace(/^#/, ""),
        id: value.id,
        name: value.name,
        categoryID: value.categoryID,
      }
    }).catch(() => {
      const categories: CategoryResponse[] = _.merge(store.value.todo.categories);
      const category = categories.find((a) => a.id === value.categoryID);
      category.tags.splice(prevTagIndex, 1, prevTag);
      store.set({
        todo: {
          categories
        }
      });
    });
  }

  delete(value) {
    const categories: CategoryResponse[] = _.merge([], store.value.todo.categories);
    const category = categories.find((a) => a.id === value.categoryID);
    const indexOf = category.tags.findIndex((a) => a.id === value.tagID);
    const prevTag = category.tags[indexOf];

    category.tags.splice(indexOf, 1);

    store.set({
      todo: {
        categories,
      }
    });

    ajax.post(path.join("/tags/", value.categoryID), {
      data: {
        action: "delete",
        id: value.tagID,
      }
    })
      .catch(function () {
        const categories: CategoryResponse[] = _.merge([], store.value.todo.categories);
        const category = categories.find((a) => a.id === value.categoryID);
        category.tags.splice(indexOf, 0, prevTag);
        store.set({
          todo: {
            categories,
          }
        });
      });
  }
}