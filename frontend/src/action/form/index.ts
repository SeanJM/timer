import Service from "@frontend/action/form/service";
export * from "./service";
const service = new Service();

export default function (subscribe) {
  subscribe("FORM_VALUE", function (e) {
    service.value(e);
  });

  subscribe("FORM_VALIDATE", function (e) {
    service.validate(e);
  });
}