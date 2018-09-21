import express from "express";
import { Database } from "@backend/class/database";

import { Request, Response } from "express";
import Validate from "verified";
import generateHash from "@generate-hash";
import { TodoElement, TodoResponse } from "@types";
import path from "@path";

const TODO_NOT_FOUND = "TODO__ID_DOES_NOT_EXIST";
const CATEGORY_NOT_FOUND = "CATEGORY_ID_DOES_NOT_EXIST";

export function toTodoResponse(todoElement: TodoElement): TodoResponse {
  return {
    completedDate: todoElement.attributes.completedDate,
    created: todoElement.attributes.created,
    id: todoElement.attributes.id,
    name: todoElement.attributes.name,
    notes: todoElement.attributes.notes,
    priority: todoElement.attributes.priority,
    progress: todoElement.attributes.progress,
    state: todoElement.attributes.state,
    tags: todoElement.attributes.tags,
  };
}

export interface TodoRequestBody {
  name?: string;
  progress?: number;
  notes?: string;
  priority?: number;
  tags?: string[];
  state?: "incomplete" | "complete";
  action:
    | "complete"
    | "create"
    | "delete"
    | "edit"
    | "incomplete"
    ;
}

export interface TodoRequestParams {
  categoryID: string;
  todoID?: string;
}

export interface TodoRequest extends Request {
  params: TodoRequestParams;
  body: TodoRequestBody;
  path: string;
}

function createTodo(req: TodoRequest, res: Response, database: Database) {
  const todoElement =
    database.createElement<TodoElement>("todo", {
      id: generateHash(6),
      name: req.body.name,
      state: "incomplete",
      progress: 0,
      priority: 0,
      tags: [],
      created: new Date().getTime(),
      completedDate: null,
      notes: null
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
    res.status(404).send(CATEGORY_NOT_FOUND);
  } else {
    res.status(404).send(TODO_NOT_FOUND);
  }
}

function completeTodo(req: TodoRequest, res, database) {
  let categoryElement =
    database.getElementById(req.params.categoryID);

  let todoElement: TodoElement =
    database.getElementById(req.params.todoID);

  if (categoryElement && todoElement) {
    todoElement.setAttributes({
      state: "complete",
      completedDate: new Date().getTime(),
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
    todoElement.setAttributes({
      name: req.body.name || todoElement.attributes.name,
      tags: req.body.tags || todoElement.attributes.tags,
      notes: req.body.notes || todoElement.attributes.notes,
      progress:
        isNaN(req.body.progress)
          ? todoElement.attributes.progress
          : req.body.progress,
      priority:
        isNaN(req.body.priority)
          ? todoElement.attributes.priority
          : req.body.priority,
    });
    res.send(toTodoResponse(todoElement));
    database.save();
  } else if (!categoryElement) {
    res.status(404).send(CATEGORY_NOT_FOUND);
  } else {
    res.status(404).send(TODO_NOT_FOUND);
  }
}

function onPost(req: TodoRequest, res, database: Database) {
  const bodyValidator =
    new Validate({
      "name?": "string",
      "tags?": "Array<string|undefined>",
      "id?": "string",
      "notes?": "string|null",
      "progress?": "number",
      "priority?": "number",
      action: `
        | complete
        | create
        | delete
        | edit
        | incomplete
      `,
    });

  const validated = bodyValidator.validate(req.body);

  if (validated.isValid) {
    if (req.body.action === "create") {
      createTodo(req, res, database);
    } else if (req.body.action === "delete") {
      deleteTodo(req, res, database);
    } else if (req.body.action === "complete") {
      completeTodo(req, res, database);
    } else if (req.body.action === "incomplete") {
      incompleteTodo(req, res, database);
    } else if (req.body.action === "edit") {
      editTodo(req, res, database);
    }
  } else {
    res.status(500).send("TODO__INVALID_REQUEST");
  }
}

export function todo(database: Database, app) {
  const router = express.Router();

  app.use("/todo/", function (req: TodoRequest, res, next) {
    req.params =
      path(req.path).params<TodoRequestParams>("/:categoryID/:todoID");

    switch (req.method) {
      case "POST": {
        onPost(req, res, database);
      }
    }

    next();
  });

  return router;
}