import path from "@path";
export const pathname = "/:type/:categoryID";
export const root = "/:type/";

export const tagsRoot = path.replace(root, { type: "tags" });
export const todoRoot = path.replace(root, { type: "todo" });

export const params = {
  todoCategory: path.replace(pathname, { type: "todo" }),
  tagsCategory: path.replace(pathname, { type: "tags" }),
};