import { store } from "@frontend/store";
import { StoreForm, StoreFormInput } from "@types";
import Validator from "verified";

const validators = {
  Text(value) {
    return !!(
      typeof value === "string" &&
      value.length
    );
  }
};

const errorMessage = {
  Text: "Invalid value"
};

interface FormValueEvent {
  id: string;
  type?: string;
  value: any;
  name: string;
}

export function emptyForm(id: string): StoreForm {
  return {
    id: id,
    input: {},
    isValid: true,
    showValidation: false,
  };
}

export default class Service {
  constructor() {

  }

  value(e: FormValueEvent) {
    const formElement: StoreForm = store.value.form[e.id] || emptyForm(e.id);
    const type = e.type ? e.type[0].toUpperCase() + e.type.substring(1) : "Any";
    const isValid = e.type ? new Validator(type, validators).validate(e.value).isValid : true;
    let input = formElement.input[e.name];

    if (!input) {
      formElement.input[e.name] = {} as StoreFormInput;
      input = formElement.input[e.name];
    }

    Object.assign(input, {
      name: e.name,
      value: e.value,
      type: e.type,
      isValid,
      errorMessage: !isValid
        ? errorMessage[type]
        : null
    });

    store.set({
      form: {
        [e.id]: formElement
      }
    });
  }

  validate(e) {
    const formElement: StoreForm = store.value.form[e.id] || emptyForm(e.id);

    formElement.isValid = true;
    for (var k in formElement.input) {
      if (!formElement.input[k].isValid) {
        formElement.isValid = false;
      }
    }

    store.set({
      form: {
        [e.id]: formElement,
      }
    });
  }
}