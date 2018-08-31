import ajax from "@ajax";
import { store } from "@frontend/store";
import { TagResponse, TagCategory } from "@types";
import { replaceById } from "@replace-by-id";
import path from "@path";
import generateHash from "@generate-hash";
import _ from "lodash";

export default class Service {
  get(e) {
    ajax.get(path.join("/tags/", e.categoryID))
      .then(function (tags: TagResponse[]) {
        const categories: TagCategory[] = _.merge([], store.value.tags.categories);
        const category = categories.find(a => a.id === e.categoryID);
        const mappedTags = tags.map(tag => ({ ...tag, color: tag.color ? "#" + tag.color : null }));

        if (category) {
          category.tags = mappedTags;
        } else {
          categories.push({
            id: e.categoryID,
            tags: mappedTags,
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

    const nextTag: TagResponse = {
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
      } as Pick<TagResponse, "color" | "name">
    })
      .then(function (tag: TagResponse) {
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