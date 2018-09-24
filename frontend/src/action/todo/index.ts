import Service from "@frontend/action/todo/service";

export default function (subscribe) {
  const service = new Service();

  subscribe("TODO", (e) => {
    switch (e.type) {
      case "EDIT": {
        service.edit(e.value);
      }
    }
  });

  subscribe("ADD_TODO", function (e) {
    service.addTodo(e);
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