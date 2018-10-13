import { DatabaseElement } from "@backend/class/element";

export type TodoElement = DatabaseElement<{
  tagName: "todo";
  attributes: {
    completedDate: null | number;
    priority: number;
    notes: null | string;
    tags: string[];
  };
}>;

export type TodoResponse =
  Pick<TodoElement["attributes"],
    | "completedDate"
    | "created"
    | "id"
    | "name"
    | "notes"
    | "priority"
    | "progress"
    | "state"
    | "tags"
  >;