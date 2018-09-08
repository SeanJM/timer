import Service from "@frontend/action/form/service";
export * from "./service";
const service = new Service();

export function form(subscribe) {
  subscribe("FORM_VALUE", function (e) {
    service.value(e);
  });

  subscribe("FORM", function ({ type, value }) {
    switch (type) {
      case "CLEAR": {
        service.clear(value);
        break;
      }

      case "VALIDATE": {
        service.validate(value);
        break;
      }
    }
  });
}