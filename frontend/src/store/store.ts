import Persistore from "@frontend/class/persistore";
import Validator from "verified";

import {
  CategoryAllResponse,
  CategoryResponse,
  ColorState,
  FilterResponse,
  Shortcut,
} from "@types";

import {
  StoreAlert,
  StoreDropdown,
  StoreForm,
} from "./store-types";

export interface StoreState {
  shortcut: Shortcut;
  dropdown: StoreDropdown;

  alerts: StoreAlert[];

  layout: {
    todoEditorDefaultWidth?: number;
    tagEditorDefaultWidth?: number;
    filterEditorDefaultWidth?: number;
  };

  contextMenu: string[];

  routes: {
    schema: string
  };

  categories: {
    setName: boolean;
  };

  todo: {
    todoSettings?: CategoryAllResponse["todoSettings"],
    categories?: CategoryResponse[];
    selected?: string[];
    isRequest?: null | boolean;
    isSuccess?: null | boolean;
  };

  color: ColorState;

  filters: {
    elements: FilterResponse[];
    isRequest?: null | boolean;
    isSuccess?: null | boolean;
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

    contextMenu: [],
    dropdown: {},

    alerts: [],

    shortcut: null,

    layout: {
      todoEditorDefaultWidth: 400,
      tagEditorDefaultWidth: 400,
      filterEditorDefaultWidth: 400
    },

    categories: {
      setName: false,
    },

    filters: {
      elements: [],
      isRequest: null,
      isSuccess: null,
    },

    todo: {
      todoSettings: {},
      categories: [],
      selected: [],
      isRequest: null,
      isSuccess: null,
    },

    color: {
      colorPickers: [],
      palette: [],
    },

    modal: {
      name: null,
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

        filters: {
          elements: [],
          isRequest: null,
          isSuccess: null,
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
    ignore: [
      /^alerts/,
      /^categories\.setName/,
      /^color\.colorPickers/,
      /^contextMenu/,
      /^form\./,
      /^slideOut\./,
    ]
  }
);