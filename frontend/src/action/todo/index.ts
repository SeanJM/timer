import { TodoService } from "@frontend/action/todo/service";

export interface Subscribe {
  (name: "TODO", callback: (e: { type: string, value: any }) => void): void;
}

export interface TodoDispatch {
  (name: "TODO", e: { type: "ADD", value: { name: string, tags: string[], categoryID: string } }): void;
}

export interface TodoDispatch {
  (name: "TODO", e: { type: "EDIT", value: any }): void;
}

export interface TodoDispatch {
  (name: "TODO", e: { type: "DELETE", value: { categoryID: string, idList: string[] } }): void;
}

export interface TodoDispatch {
  (name: "TODO", e: { type: "DESELECT", value: { categoryID: string, idList: string[] } }): void;
}

export interface TodoDispatch {
  (name: "TODO", e: { type: "SELECT", value: { categoryID: string, idList: string[] } }): void;
}

export interface TodoDispatch {
  (name: "TODO", e: { type: "INCOMPLETE", value: { categoryID: string, idList: string[] } }): void;
}

export interface TodoDispatch {
  (name: "TODO", e: { type: "COMPLETE", value: { categoryID: string, idList: string[] } }): void;
}

export function todo(subscribe: Subscribe) {
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