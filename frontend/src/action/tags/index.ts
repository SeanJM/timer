import { Service } from "./service";
const service = new Service();

export function tags(subscribe) {
  subscribe("CREATE_TAG", (e) => service.createTag(e));
  subscribe("TAG", ({ type, value }) => {
    switch (type) {
      case "DELETE": {
        service.delete(value);
        break;
      }

      case "EDIT": {
        service.edit(value);
      }
    }
  });
}
