import { DatabaseElement } from "@backend/class/element";
import "./verified";

export type CategoryElementAttributes =
  Pick<DatabaseElement["attributes"],
  | "id"
  | "created"
  | "name"
  >;

export interface CategoryElement extends
  DatabaseElement {
    type: "category";
    attributes: CategoryElementAttributes;
    children: TodoElement[];
  }

export interface CategoryResponse extends
  Pick<CategoryElementAttributes, "id" | "created" | "name"> {
    todos: TodoResponse[];
    tags: TagResponse[];
  }

export interface InputOnValue {
  (value: any, name: string): void;
}

export interface SwatchAttributes {
  value: string;
  created: number;
  id: string;
}

export interface StoreForm {
  input: {
    [key: string]: StoreFormInput
  };
  id: string;
  isValid: boolean;
  showValidation: boolean;
}

export interface StoreFormInput {
  name: string;
  value: any;
  type?: string;
  isValid?: boolean;
  errorMessage?: string | null;
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

export interface TagElement extends DatabaseElement {
  type: "tag";
  attributes: {
    name: string;
    id: string;
    color: string;
    created: number;
  };
  children: any[];
}

export interface TodoElement extends DatabaseElement {
  type: "todo";
  attributes: {
    progress: number;
    priority: number;
    notes: null | string;
    tags: string[];
  } & Pick<DatabaseElement["attributes"],
  | "id"
  | "created"
  | "name"
  | "state"
  >;
  children: any[];
}

export type TodoResponse =
  Pick<TodoElement["attributes"],
    | "created"
    | "id"
    | "name"
    | "notes"
    | "priority"
    | "progress"
    | "state"
    | "tags"
  >;

export interface Keys {
  control: boolean;
}

export interface ColorPicker {
  id: string;
  value: string;
  isOpen: boolean;
}

export interface ColorState {
  colorPickers?: ColorPicker[];
  palette?: SwatchAttributes[];
}