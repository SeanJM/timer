import Element from "@backend/class/element";

export interface TodoElement extends
  Element {
  type: "todo";
  attributes: Pick<Element["attributes"], "id" | "created" | "name" | "state">;
  children: any[];
}

export type TodoResponse =
  Pick<Element["attributes"],
    | "id"
    | "created"
    | "name"
    | "state"
  >;

export type CategoryElementAttributes =
  Pick<Element["attributes"],
  | "id"
  | "created"
  | "name"
  >;

export interface CategoryElement extends
  Element {
  type: "category";
  attributes: CategoryElementAttributes;
  children: TodoElement[];
}

export interface CategoryResponse extends
  Pick<CategoryElementAttributes, "id" | "created" | "name"> {
  todos: TodoResponse[];
}

export interface SwatchAttributes {
  value: string;
  created: number;
  id: string;
}

export interface TagNode {
  name: string;
  id: string;
  color: string;
  created: number;
}

export interface Keys {
  control: boolean;
}

export interface ColorPicker {
  id: string;
  value: string;
  isOpen: boolean;
}

export interface Color {
  items?: ColorPicker[];
  palette?: SwatchAttributes[];
}