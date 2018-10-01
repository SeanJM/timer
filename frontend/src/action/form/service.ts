import { store, StoreForm, StoreFormInput } from "@frontend/store";
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
  string: "Invalid value"
};

interface FormValueEvent {
  id: string;
  type?: string;
  value: any;
  name: string;
}

export function emptyForm(id: string, members: string[] = []): StoreForm {
  const input = {};
  let i = -1;
  const n = members.length;

  while (++i < n) {
    input[members[i]] = {
      value: null
    };
  }

  return {
    id: id,
    input,
    isValid: true,
    showValidation: false,
  };
}

export class Service {
  constructor() {

  }

  clear(value) {
    store.set({
      form: { [value.id]: undefined },
    });
  }

  value(e: FormValueEvent) {
    const formElement: StoreForm = store.value.form[e.id] || emptyForm(e.id);
    const type = e.type || "any";
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