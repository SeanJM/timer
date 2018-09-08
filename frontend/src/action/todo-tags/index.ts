import { Service } from "./service";
const service = new Service();

export function todoTags(subscribe) {
  subscribe("CREATE_TAG", (e) => service.createTag(e));
  subscribe("TAG", (e) => {
    switch (e.type) {
      case "DELETE": {
        service.delete(e.value);
        break;
      }
    }
  });
}
