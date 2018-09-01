import ajax from "@ajax";
import { store } from "@frontend/store";
import { TagResponse, CategoryResponse } from "@types";
import { replaceById } from "@replace-by-id";
import path from "@path";
import generateHash from "@generate-hash";
import _ from "lodash";

export default class Service {
  createTag(e) {
    const categories: CategoryResponse[] = _.merge([], store.value.todo.categories);
    const category = categories.find(a => a.id === e.categoryID);

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
        color: e.color.substring(1),
        name: e.name,
      } as Pick<TagResponse, "color" | "name">
    })
      .then(function (tag: TagResponse) {
        const categories: CategoryResponse[] = _.merge([], store.value.todo.categories);
        const category = categories.find(a => a.id === e.categoryID);
        replaceById(category.tags, { ...tag, color: "#" + tag.color }, nextTag);
        store.set({
          todo: {
            categories,
          }
        });
      });
  }
}