import Service from "@frontend/action/todo/service";

export default function (subscribe) {
  const service = new Service();

  subscribe("GET_CATEGORIES", function () {
    service.getCategories();
  });

  subscribe("TODO_DELETE_CATEGORY", function (e) {
    service.deleteCategory(e);
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

  subscribe("ADD_CATEGORY", function (e) {
    service.addCategory(e);
  });
}