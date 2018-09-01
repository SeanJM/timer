import express from "express";
import Database from "@backend/class/database";

import { Request, Response } from "express";
import Validate from "verified";
import generateHash from "@generate-hash";
import { TodoElement, TodoResponse } from "@types";
import path from "@path";
import _ from "lodash";

const TODO_NOT_FOUND = "TODO__ID_DOES_NOT_EXIST";
const CATEGORY_NOT_FOUND = "CATEGORY_ID_DOES_NOT_EXIST";

export function toTodoResponse(todoElement: TodoElement): TodoResponse {
  return {
    id: todoElement.attributes.id,
    created: todoElement.attributes.created,
    name: todoElement.attributes.name,
    state: todoElement.attributes.state,
  }
}

export interface TodoRequestQuery {
  name?: string;
  state?: "incomplete" | "complete";
  action:
    | "create"
    | "delete"
    | "complete"
    | "incomplete"
    | "edit"
    ;
}

export interface TodoRequestParams {
  categoryID: string;
  todoID?: string;
}

export interface TodoRequest extends Request {
  params: TodoRequestParams;
  query: TodoRequestQuery;
  path: string;
}

function createTodo(req: TodoRequest, res: Response, database: Database) {
  const todoElement =
    database.createElement<TodoElement>("todo", {
      id: generateHash(6),
      name: req.query.name,
      state: "incomplete",
      created: new Date().getTime(),
    });

  let categoryElement =
    database.getElementById(req.params.categoryID);

  categoryElement.appendChild(todoElement);

  res.send(
    toTodoResponse(todoElement)
  );

  database.save();
}

function deleteTodo(req: TodoRequest, res: Response, database) {
  let categoryElement =
    database.getElementById(req.params.categoryID);

  let todoElement =
    database.getElementById(req.params.todoID);

  if (categoryElement && todoElement) {
    categoryElement.removeChild(todoElement);
    res.send();
    database.save();
  } else if (!categoryElement) {
    res.status(404).send(CATEGORY_NOT_FOUND)
  } else {
    res.status(404).send(TODO_NOT_FOUND)
  }
}

function completeTodo(req: TodoRequest, res, database) {
  let categoryElement =
    database.getElementById(req.params.categoryID);

  let todoElement =
    database.getElementById(req.params.todoID);

  if (categoryElement && todoElement) {
    todoElement.setAttributes({
      state: "complete"
    });

    res.send(toTodoResponse(todoElement));
    database.save();
  } else if (!categoryElement) {
    res.status(404).send(CATEGORY_NOT_FOUND);
  } else {
    res.status(404).send(TODO_NOT_FOUND);
  }
}

function incompleteTodo(req: TodoRequest, res, database) {
  let categoryElement =
    database.getElementById(req.params.categoryID);

  let todoElement =
    database.getElementById(req.params.todoID);

  if (categoryElement && todoElement) {
    todoElement.setAttributes({
      state: "incomplete"
    });

    res.send(toTodoResponse(todoElement));
    database.save();
  } else if (!categoryElement) {
    res.status(404).send(CATEGORY_NOT_FOUND);
  } else {
    res.status(404).send(TODO_NOT_FOUND);
  }
}

function editTodo(req: TodoRequest, res, database: Database) {
  let categoryElement =
    database.getElementById(req.params.categoryID);

  let todoElement =
    database.getElementById<TodoElement>(req.params.todoID);

  if (todoElement) {
    todoElement.setAttributes(
      _.pick(req.query, ["name"])
    );
    res.send(toTodoResponse(todoElement));
  } else if (!categoryElement) {
    res.status(404).send(CATEGORY_NOT_FOUND);
  } else {
    res.status(404).send(TODO_NOT_FOUND);
  }
}

function onPost(req: TodoRequest, res, database: Database) {
  const queryValidator =
    new Validate({
      "name?": "string",
      "id?": "string",
      action: "create|delete|complete|incomplete|edit",
    });

  if (queryValidator.validate(req.query).isValid) {
    if (req.query.action === "create") {
      createTodo(req, res, database);
    } else if (req.query.action === "delete") {
      deleteTodo(req, res, database)
    } else if (req.query.action === "complete") {
      completeTodo(req, res, database);
    } else if (req.query.action === "incomplete") {
      incompleteTodo(req, res, database);
    } else if (req.query.action === "edit") {
      editTodo(req, res, database);
    }
  } else {
    res.status(500).send("TODO__INVALID_REQUEST");
  }
}

export default function (database: Database, app) {
  const router = express.Router();

  app.use("/todo/", function (req: TodoRequest, res, next) {
    req.params =
      path(req.path).params<TodoRequestParams>("/:categoryID/:todoID");

    switch (req.method) {
      case "POST": {
        onPost(req, res, database);
        break;
      }
    }

    next();
  });

  return router;
}