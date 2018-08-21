import ajax from "@scripts/ajax";
import { store, TagNode } from "@store";
import path from "@path";

export default class Service {
  get(e) {
    ajax.get(path.join("/tags/", e.categoryID))
      .then(function (tags: TagNode[]) {
        store.set({
          tags,
        });
      });
  }

  createTag(e) {
    ajax.post(path.join("/todo/tags/", e.categoryID), {
      data: {
        action: "create",
        colorID: e.colorID,
        name: e.name,
      } as Pick<TagNode, "colorID" | "name">
    })
      .then(function (tag: TagNode) {
        store.set({
          tags: store.value.tags.concat(tag)
        });
      });
  }
}