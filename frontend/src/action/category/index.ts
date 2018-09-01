import Service from "./service";
const service = new Service();

export default function (subscribe) {
  subscribe("CATEGORY", function (e) {
    switch (e.type) {
      case "SET_NAME": {
        service.setName();
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
        break;
      }
    }
  });
}