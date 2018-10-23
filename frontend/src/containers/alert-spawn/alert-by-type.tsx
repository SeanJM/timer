import { AlertCreateTag } from "./alert-create-tag";
import { AlertTagDelete } from "./alert-tag-delete";
import { AlertTodoDelete } from "./alert-todo-delete";

export const alertByType = {
  "CREATE_TAG": AlertCreateTag,
  "TAG_DELETE": AlertTagDelete,
  "TODO_DELETE": AlertTodoDelete,
};