import Persistore from "@frontend/class/persistore";
import { Keys, ColorState, CategoryResponse, TagsByCategory, StoreForm } from "@types";
import Validator from "verified";

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

  routes: {
    schema: string
  };

  categories: {
    setName: boolean;
  };

  todo: {
    categories?: CategoryResponse[];
    isRequest?: null | boolean;
    isSuccess?: null | boolean;
  };

  color: ColorState;

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
    routes: {
      schema: ":type/:categoryID/:elementID/"
    },

    keys: {
      control: false,
    },

    categories: {
      setName: false,
    },

    todo: {
      categories: [],
      isRequest: null,
      isSuccess: null,
    },

    color: {
      colorPickers: [],
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
    validator: (store) => {
      const validator = new Validator({
        keys: {
          control: "boolean",
        },

        categories: {
          setName: "boolean",
        },

        color: {
          colorPickers: "any[]",
          palette: "any[]",
        }
      }).validate(store);
      console.log(validator);
      return validator.isValid;
    },
    ignore: [/^form\./, /^slideOut\./, /^color\.items/, /^categories\.setName/]
  }
);