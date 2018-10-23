import _ from "lodash";
import ajax from "@ajax";
import generateHash from "@generate-hash";
import path from "@path";
import { store } from "@frontend/store";
import { TagResponse, CategoryResponse } from "@types";

export interface TagEditValue {
  categoryID: string;
  id: string;
  name: string;
  color: string;
}

export class Service {
  create(value) {
    const { categoryID, idList, color, name } = value;
    const categories: CategoryResponse[] = _.merge([], store.value.todo.categories);
    const category = categories.find((a) => a.id === categoryID);

    const nextTag: TagResponse = {
      created: new Date().getTime(),
      name,
      color,
      id: generateHash(),
    };

    category.tags.push(nextTag);

    if (idList) {
      idList.forEach((id: string) => {
         category.todos.forEach((todo) => {
           if (todo.id === id) {
             todo.tags.push(nextTag.id);
           }
         });
      });
    }

    store.set({
      todo: {
        categories,
      }
    });

    ajax.post(path.join("/tags/", categoryID), {
      data: {
        action: "create",
        color: color ? color.substring(1) : null,
        idList,
        name,
      } as Pick<TagResponse, "color" | "name">
    })
      .then(function (tag: TagResponse) {
        const categories: CategoryResponse[] = _.merge([], store.value.todo.categories);
        const category = categories.find((a) => a.id === categoryID);

        category.tags.forEach((a) => {
          if (a.id === nextTag.id) {
            Object.assign(a, {
              ...tag,
              color: tag.color ? "#" + tag.color : null
            });
          }
        });

        /**
          Replace the temporariliy created tag ids
        */
        if (idList) {
          idList.forEach((id: string) => {
             category.todos.forEach((todo) => {
               if (todo.id === id) {
                 todo.tags =
                   todo.tags.map((id) => id === nextTag.id ? tag.id : id);
               }
             });
          });
        }

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

  delete({ categoryID, idList }) {
    const categories: CategoryResponse[] = _.merge([], store.value.todo.categories);
    const category = categories.find((a) => a.id === categoryID);
    const prevTags: CategoryResponse["tags"] = _.merge([], category.tags);

    category.tags =
      category.tags.filter((tag) => idList.indexOf(tag.id) === -1);

    store.set({
      todo: {
        categories,
      }
    });

    ajax.post(path.join("/tags", categoryID), {
      data: {
        action: "delete",
        idList,
      }
    })
      .catch(function () {
        const categories: CategoryResponse[] = _.merge([], store.value.todo.categories);
        const category = categories.find((a) => a.id === categoryID);
        category.tags = prevTags;
        store.set({
          todo: {
            categories,
          }
        });
      });
  }
}