import Persistore from "@frontend/class/persistore";
import { Keys, Color, CategoryResponse, TagsByCategory, StoreForm } from "@types";

export interface TodoNode {
  attributes: {
    state: string;
    id: string;
    name: string;
    created: number;
  };
  children: any[];
}

export interface Category extends TodoNode {
}

export interface StoreState {
  keys: Keys;

  todo: {
    categories?: CategoryResponse[];
    isRequest?: null | boolean;
    isSuccess?: null | boolean;
  };

  color: Color;

  tags: TagsByCategory;

  slideOut: {
    type: string | null;
    value: any | null;
  };

  modal: {
    name: string | null;
    value: any | null;
  };

  form: { [key: string]: StoreForm };
}

export const store = new Persistore<StoreState>(
  {
    keys: {
      control: false,
    },

    todo: {
      categories: [],
      isRequest: null,
      isSuccess: null,
    },

    color: {
      items:[],
      palette: [],
    },

    tags: {
      categories: [],
    },

    modal: {
      name: null,
      value: {}
    },

    slideOut: {
      type: null,
      value: {}
    },

    form: {}
  } as StoreState,
  {
    ignore: [/^form\./, /^slideOut\./, /^color\.items/]
  }
);