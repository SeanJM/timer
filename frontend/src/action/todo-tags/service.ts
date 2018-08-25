import ajax from "@ajax";
import { store } from "@frontend/store";
import { TagNode } from "@types";
import { replaceById } from "@replace-by-id";
import path from "@path";
import generateHash from "@generate-hash";
import _ from "lodash";

export default class Service {
  get(e) {
    ajax.get(path.join("/tags/", e.categoryID))
      .then(function (tags: TagNode[]) {
        store.set({
          tags: tags.map((tag) => {
            return {
              ...tag,
              color: "#" + tag.color
            }
          })
        });
      });
  }

  createTag(e) {
    const nextTag: TagNode = {
      created: new Date().getTime(),
      name: e.name,
      color: e.color,
      id: generateHash(),
    };

    store.set({
      tags: store.value.tags.concat(nextTag)
    });

    ajax.post(path.join("/tags/", e.categoryID), {
      data: {
        action: "create",
        color: e.color.substring(1),
        name: e.name,
      } as Pick<TagNode, "color" | "name">
    })
      .then(function (tag: TagNode) {
        const tags: TagNode[] = _.merge([], store.value.tags);
        store.set({
          tags: replaceById(tags, { ...tag, color: "#" + tag.color }, nextTag)
        });
      });
  }
}