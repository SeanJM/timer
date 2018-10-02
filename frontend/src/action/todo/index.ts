import { TodoService } from "@frontend/action/todo/service";

export default function (subscribe) {
  const service = new TodoService();

  subscribe("TODO", ({ type, value }) => {
    switch (type) {
      case "EDIT": {
        service.edit(value);
        break;
      }

      case "ADD": {
        service.addTodo(value);
      }
    }
  });

  subscribe("INCOMPLETE_TODO", function (e) {
    service.incomplete(e);
  });

  subscribe("COMPLETE_TODO", function (e) {
    service.complete(e);
  });

  subscribe("DELETE_TODO", function (e) {
    service.delete(e);
  });
}