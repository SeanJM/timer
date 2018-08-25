import path from "@path";
export const pathname = "/:type/:categoryID/:todoID";
export const root = "/:type/";

export const routes = {
  pathname,
  root,

  tags: path.reduce(pathname, {
    type: "tags",
    categoryID: true,
  }),

  todo: path.reduce(pathname, {
    type: "todo",
    categoryID: true,
  }),
};
