import { store, FormElement, FormElementInput } from "@frontend/store";

type InputQuery = Partial<FormElementInput>;

export default class Service {
  constructor() {

  }

  createInput(formElement: FormElement, query: InputQuery) {
    const input: FormElementInput = {
      name: query.name,
      value: query.value,
      type: query.type,
      isValid: query.isValid,
      errorMessage: query.errorMessage,
    };

    formElement.inputs.push(input);
    return input;
  }

  getInput(formElement: FormElement, query: InputQuery) {
    const input = formElement.inputs.find((input) => input.name === query.name);

    if (input) {
      return input;
    }

    return this.createInput(formElement, query);
  }

  getFormByID(id) {
    const formElement =
      store.value.form.find((form) => form.id === id);

    if (formElement) {
      return formElement;
    }

    store.value.form.push(this.createForm(id));
    return this.getFormByID(id);
  }

  createForm(id: string): FormElement {
    return {
      id,
      inputs: [],
      isValid: true,
      showValidation: false,
    };
  }
}