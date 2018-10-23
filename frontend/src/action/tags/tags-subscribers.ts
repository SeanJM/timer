import { Service } from "./tags-service";
const service = new Service();

export function tags(subscribe) {
  subscribe("TAG", ({ type, value }) => {
    switch (type) {
      case "DELETE": {
        service.delete(value);
        break;
      }

      case "CREATE": {
        service.create(value);
        break;
      }

      case "EDIT": {
        service.edit(value);
      }
    }
  });
}
