import ajax from "@ajax";
import { store } from "@frontend/store";
import { TagNode, TagCategory } from "@types";
import { replaceById } from "@replace-by-id";
import path from "@path";
import generateHash from "@generate-hash";
import _ from "lodash";

export default class Service {
  get(e) {
    ajax.get(path.join("/tags/", e.categoryID))
      .then(function (tags: TagNode[]) {
        const categories: TagCategory[] = _.merge([], store.value.tags.categories);
        const category = categories.find(a => a.id === e.categoryID);

        if (category) {
          category.tags = tags;
        } else {
          categories.push({
            id: e.categoryID,
            tags,
          });
        }

        store.set({
          tags: {
            categories,
          }
        });
      });
  }

  createTag(e) {
    const categories: TagCategory[] = _.merge([], store.value.tags.categories);
    const category = categories.find(a => a.id === e.categoryID);

    const nextTag: TagNode = {
      created: new Date().getTime(),
      name: e.name,
      color: e.color,
      id: generateHash(),
    };

    category.tags.push(nextTag);

    store.set({
      tags: {
        categories,
      }
    });

    ajax.post(path.join("/tags/", e.categoryID), {
      data: {
        action: "create",
        color: e.color.substring(1),
        name: e.name,
      } as Pick<TagNode, "color" | "name">
    })
      .then(function (tag: TagNode) {
        const categories: TagCategory[] = _.merge([], store.value.tags.categories);
        const category = categories.find(a => a.id === e.categoryID);
        replaceById(category.tags, { ...tag, color: "#" + tag.color }, nextTag);
        store.set({
          tags: {
            categories,
          }
        });
      });
  }
}