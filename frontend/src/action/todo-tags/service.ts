import ajax from "@scripts/ajax";
import { store, TodoTag } from "@store";
import path from "@path";

export default class Service {
  createTag(e) {
    ajax.post(path.join("/todo/tags/", e.categoryID), {
      data: {
        action: "create",
        colorID: e.colorID,
        name: e.name,
      } as Pick<TodoTag, "colorID" | "name">
    })
      .then(function (tag: TodoTag) {
        store.set({
          tags: store.value.tags.concat(tag)
        });
      });
  }
}