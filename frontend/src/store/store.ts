import Persistore from "@class/persistore";

export interface FormElementInput {
  name: string;
  type: string;
  value: object;
  isValid: boolean;
  errorMessage: string | null;
}

export interface FormElement {
  id: string;
  inputs: FormElementInput[];
  isValid: boolean;
  showValidation: boolean;
}

export interface TodoNode {
  id: string;
  name: string;
  created: number;
  children: any[];
}

export interface Category extends TodoNode {
}

export interface StoreState {
  keys: {
    control: boolean;
  };

  todo: {
    categories?: Category[];
    isRequest?: null | boolean;
    isSuccess?: null | boolean;
  };

  modal: {
    name: string | null;
    value: any | null;
  };

  form: FormElement[];
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

    modal: {
      name: null,
      value: {}
    },

    form: []
  } as StoreState,
  {
    ignore: [/^form\./]
  }
);