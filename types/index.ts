import { DatabaseElement } from "@backend/class/element";
import { FilterResponse } from "./filter";
import "./verified";
export * from "./filter";
export * from "./input";
export * from "./util";

export interface CategoryElementAttributes extends
  Pick<DatabaseElement["attributes"],
  | "id"
  | "created"
  | "name"
  > {
  sortBy: CategorySortBy;
  filterBy: string | null;
}

export interface CategoryAllResponse {
  todoSettings: {
    priorityLength: number,
  };
  categories: CategoryResponse[];
}

export type CategoryElement = DatabaseElement<{
  type: "category";
  attributes: CategoryElementAttributes;
  children: TodoElement[];
}>;

export interface CategoryResponse extends
  Pick<CategoryElementAttributes,
    | "created"
    | "filterBy"
    | "id"
    | "name"
    | "sortBy"
  > {
    filters: FilterResponse[];
    tags: TagResponse[];
    todos: TodoResponse[];
  }

export type CategorySortBy =
  | "date"
  | "priority"
  | "name"
  ;

export type CategoryFilterBy =
  | string
  | null
  ;

export interface SwatchAttributes {
  value: string;
  created: number;
  id: string;
}

export interface TagCategory {
  id: string;
  tags: TagResponse[];
}

export interface TagsByCategory {
  categories: TagCategory[];
}

export interface TagResponse {
  name: string;
  id: string;
  color: string;
  created: number;
}

export type TagElement = DatabaseElement<{
  tagName: "tag";
  attributes: {
    name: string;
    id: string;
    color: string;
    created: number;
  };
  children: any[];
}>;

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

export type Shortcut = string;

export interface ColorPicker {
  id: string;
  value: string;
  isOpen: boolean;
}

export interface ColorState {
  colorPickers?: ColorPicker[];
  palette?: SwatchAttributes[];
}
