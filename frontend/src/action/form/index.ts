import { store } from "@store";
import Validator from "verified";
import * as _ from "lodash";
import Service from "@action/form/service";

const service = new Service();

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

export default function (subscribe) {
  subscribe("FORM_VALUE", function (e) {
    const formElement = service.getFormByID(e.id);
    const form = store.value.form;
    const type = e.type[0].toUpperCase() + e.type.substring(1);
    const isValid = new Validator(type, validators).validate(e.value).isValid;
    const input = service.getInput(formElement, e);

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
      form,
    });
  });

  subscribe("FORM_VALIDATE", function (e) {
    const formElement = _.merge({}, service.getFormByID(e.id));
    const form = _.merge([], store.value.form);
    let i = -1;
    const n = formElement.inputs.length;

    formElement.isValid = true;

    while (++i < n) {
      if (!formElement.inputs[i].isValid) {
        formElement.inputs[i].isValid = false;
        i = n;
      }
    }

    store.set({
      form,
    });
  });
}