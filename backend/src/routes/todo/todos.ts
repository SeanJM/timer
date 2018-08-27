import { Request, Response } from "express";
import Validate from "verified";
import Database from "@backend/class/database";
import generateHash from "@generate-hash";
import { TodoElement, TodoResponse } from "@types";

export function toTodoResponse(todoElement: TodoElement): TodoResponse {
  return {
    id: todoElement.attributes.id,
    created: todoElement.attributes.created,
    name: todoElement.attributes.name,
    state: todoElement.attributes.state,
  }
}

function createTodo(req: Request, res: Response, database: Database) {
  const todoElement =
    database.createElement<TodoElement>("todo", {
      id: generateHash(6),
      name: req.query.name,
      state: "incomplete",
      created: new Date().getTime(),
    });

  let categoryElement =
    database.getElementById(req.params.categoryId);

  categoryElement.appendChild(todoElement);

  res.send(
    toTodoResponse(todoElement)
  );

  database.save();
}

function deleteTodo(req: Request, res: Response, database) {
  let categoryElement =
    database.getElementById(req.params.categoryId);

  let todoElement =
    database.getElementById(req.query.id);

  if (categoryElement && todoElement) {
    categoryElement.removeChild(todoElement);
    res.send();
    database.save();
  } else if (!categoryElement) {
    res.status(404).send("CATEGORY_ID_DOES_NOT_EXIST")
  } else {
    res.status(404).send("TODO_ID_DOES_NOT_EXIST")
  }
}

function completeTodo(req, res, database) {
  let todoElement =
    database.getElementById(req.query.id);

  todoElement.setAttributes({
    state: "complete"
  });

  res.send(toTodoResponse(todoElement));
  database.save();
}

function incompleteTodo(req, res, database) {
  let todoElement =
    database.getElementById(req.query.id);

  todoElement.setAttributes({
    state: "incomplete"
  });

  res.send(toTodoResponse(todoElement));
  database.save();
}

export default function (router, database: Database) {
  router.post("/category/:categoryId", function (req: Request, res) {
    const v = new Validate({
      "name?": "string",
      "id?": "string",
      action: "create|delete|complete|incomplete",
    });

    if (v.validate(req.query).isValid) {
      if (req.query.action === "create") {
        createTodo(req, res, database);
      } else if (req.query.action === "delete") {
        deleteTodo(req, res, database)
      } else if (req.query.action === "complete") {
        completeTodo(req, res, database);
      } else if (req.query.action === "incomplete") {
        incompleteTodo(req, res, database);
      }
    } else {
      res.status(500).send("TODO__INVALID_REQUEST");
    }
  });
}