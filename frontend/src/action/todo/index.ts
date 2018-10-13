import { TodoService } from "@frontend/action/todo/service";

export function todo(subscribe) {
  const service = new TodoService();

  subscribe("TODO", ({ type, value }) => {
    switch (type) {
      case "EDIT": {
        service.edit(value);
        break;
      }

      case "DELETE": {
        service.delete(value);
        break;
      }

      case "COMPLETE": {
        service.complete(value);
        break;
      }

      case "SELECT": {
        service.select(value);
        break;
      }

      case "DESELECT": {
        service.deselect(value);
        break;
      }

      case "INCOMPLETE": {
        service.incomplete(value);
        break;
      }

      case "ADD": {
        service.addTodo(value);
      }
    }
  });
}