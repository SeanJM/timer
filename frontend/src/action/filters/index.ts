import { FilterService } from "./service";
const filterService = new FilterService();

export function filters(subscribe) {
  subscribe("FILTERS", ({ type, value }) => {
    switch (type) {
      case "CREATE": {
        filterService.createFilter(value);
        break;
      }

      case "EDIT": {
        filterService.editFilter(value);
      }

      case "DELETE": {
        filterService.deleteFilter(value);
      }
    }
  });
}