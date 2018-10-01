import { CategoryService } from "./service";
const service = new CategoryService();

export function category(subscribe) {
  subscribe("CATEGORY", function (e) {
    switch (e.type) {
      case "SET_NAME": {
        service.setName();
        break;
      }

      case "SORT_BY": {
        service.sortBy(e.value);
        break;
      }

      case "FILTER_BY": {
        service.filterBy(e.value);
        break;
      }

      case "GET_ALL": {
        service.getAll();
        break;
      }

      case "CREATE": {
        service.create(e);
        break;
      }

      case "DELETE": {
        service.delete(e.value);
      }
    }
  });
}