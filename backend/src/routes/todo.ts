import express from "express";
import { Database } from "@backend/class/database";

import { Request, Response } from "express";
import Validate from "verified";
import generateHash from "@generate-hash";
import { TodoElement, TodoResponse, CategoryElement, TagElement } from "@types";
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
  idList?: string[];

  editList: Array<{
    name?: string;
    notes?: string;
    priority?: number;
    state?: "incomplete" | "complete";
    tags?: string[];
    todoID: string;
  }>;

  name?: string;
  notes?: string;
  priority?: number;
  state?: "incomplete" | "complete";
  tags?: string[];
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

function createTodo(req: TodoRequest, res: Response, database: Database, categoryElement: CategoryElement) {
  const tagsByID =
    categoryElement.querySelectorAll<TagElement>("tag")
    .map((node) => node.attributes.id);

  const tags = req.body.tags
    ? req.body.tags.filter((tagID) => tagsByID.indexOf(tagID) !== -1)
    : [];

  const todoElement =
    database.createElement<TodoElement>("todo", {
      id: generateHash(12),
      name: req.body.name,
      state: "incomplete",
      progress: 0,
      priority: 0,
      tags,
      created: new Date().getTime(),
      completedDate: null,
      notes: null
    });

  categoryElement.appendChild(todoElement);

  res.send(
    toTodoResponse(todoElement)
  );

  database.save();
}

function deleteTodo(req: TodoRequest, res: Response, database, categoryElement: CategoryElement) {
  const idList = req.body.idList;

  if (idList) {
    let i = -1;
    const n = idList.length;

    while (++i < n) {
      let todoElement =
        database.getElementById(idList[i]);

      if (todoElement) {
        categoryElement.removeChild(todoElement);
      } else {
        res.status(404).send(TODO_NOT_FOUND);
        return;
      }
    }

    res.send();
    database.save();
  } else {
    let todoElement =
      database.getElementById(req.params.todoID);

    if (todoElement) {
      categoryElement.removeChild(todoElement);
      res.send();
      database.save();
    } else {
      res.status(404).send(TODO_NOT_FOUND);
    }
  }
}

function completeTodo(req: TodoRequest, res, database, categoryElement: CategoryElement) {
  const idList = req.body.idList;

  if (idList) {
    let i = -1;
    const n = idList.length;

    while (++i < n) {
      let todoElement =
        database.getElementById(idList[i]);

      if (todoElement) {
        todoElement.setAttributes({
          state: "complete",
          completedDate: new Date().getTime(),
        });
      } else {
        res.status(404).send(TODO_NOT_FOUND);
        return;
      }
    }

    res.send();
    database.save();
  } else {
    let todoElement: TodoElement =
      database.getElementById(req.params.todoID);

    if (todoElement) {
      todoElement.setAttributes({
        state: "complete",
        completedDate: new Date().getTime(),
      });

      res.send(toTodoResponse(todoElement));
      database.save();
    } else {
      res.status(404).send(TODO_NOT_FOUND);
    }
  }
}

function incompleteTodo(req: TodoRequest, res, database, categoryElement: CategoryElement) {
  const idList = req.body.idList;

  if (idList) {
    let i = -1;
    const n = idList.length;

    while (++i < n) {
      let todoElement =
        database.getElementById(idList[i]);

      if (todoElement) {
        todoElement.setAttributes({
          state: "incomplete",
          completedDate: null,
        });
      } else {
        res.status(404).send(TODO_NOT_FOUND);
        return;
      }
    }

    res.send();
    database.save();
  } else {
    let todoElement: TodoElement =
      database.getElementById(req.params.todoID);

    if (todoElement) {
      todoElement.setAttributes({
        state: "incomplete",
        completedDate: null,
      });

      res.send(toTodoResponse(todoElement));
      database.save();
    } else {
      res.status(404).send(TODO_NOT_FOUND);
    }
  }
}

function editTodo(req: TodoRequest, res, database: Database, categoryElement: CategoryElement) {
  const { editList } = req.body;
  let i = -1;
  const n = editList.length;

  while (++i < n) {
    let todoElement =
      database.getElementById<TodoElement>(editList[i].todoID);

    if (todoElement) {
      todoElement.setAttributes({
        name: editList[i].name || todoElement.attributes.name,
        notes: editList[i].notes || todoElement.attributes.notes,
        tags: editList[i].tags || todoElement.attributes.tags,

        priority:
          isNaN(editList[i].priority)
            ? todoElement.attributes.priority
            : editList[i].priority,
      });
    } else {
      res.status(404).send(TODO_NOT_FOUND);
      return;
    }
  }

  res.send();
  database.save();
}

function onPost(req: TodoRequest, res, database: Database) {
  let categoryElement =
    database.getElementById<CategoryElement>(req.params.categoryID);

  const bodyValidator =
    new Validate({
      "id?": "string",
      "idList?": "Array<string|undefined>",
      "editList?": "Array<EditRequest|undefined>",
      "name?": "string",
      "notes?": "string|null",
      "priority?": "number",
      "progress?": "number",
      "tags?": "Array<string|undefined>",
      action: `
        | complete
        | create
        | delete
        | edit
        | incomplete
      `,
    }, {
      EditRequest: {
        "name?": "string",
        "notes?": "string",
        "priority?": "number",
        "state?": "incomplete | complete",
        "tags?": "string[]",
        "todoID": "string",
      }
    });

  const validated = bodyValidator.validate(req.body);

  if (validated.isValid) {
    if (!categoryElement) {
      res.status(404).send(CATEGORY_NOT_FOUND);
    } else {
      if (req.body.action === "create") {
        createTodo(req, res, database, categoryElement);
      } else if (req.body.action === "delete") {
        deleteTodo(req, res, database, categoryElement);
      } else if (req.body.action === "complete") {
        completeTodo(req, res, database, categoryElement);
      } else if (req.body.action === "incomplete") {
        incompleteTodo(req, res, database, categoryElement);
      } else if (req.body.action === "edit") {
        editTodo(req, res, database, categoryElement);
      }
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