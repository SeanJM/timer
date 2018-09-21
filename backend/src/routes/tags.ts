import { Request, Response, Express } from "express";
import Validate from "verified";
import { Database } from "@backend/class/database";
import generateHash from "@generate-hash";
import express from "express";
import { TagResponse, TodoElement, TagElement } from "@types";
import path from "@path";

interface TagPostRequest extends Request {
  params: {
    categoryID: string;
  };
  body: {
    action: "create" | "delete" | "edit";
    name: string;
    color: string;
    id: string;
  };
}

interface TagGetRequest extends Request {
  params: {
    categoryID: string;
  };
}

export function toTagResponse(tagElement: TagElement): TagResponse {
  return {
    name: tagElement.attributes.name,
    id: tagElement.attributes.id,
    created: tagElement.attributes.created,
    color: tagElement.attributes.color,
  };
}

function deleteTag(req: TagPostRequest, res: Response, database: Database) {
  const validateDelete = new Validate({
    action: "delete",
    "id": "string",
  });

  if (validateDelete.validate(req.body).isValid) {
    const categoryElement = database.getElementById(req.params.categoryID);
    const tagElement = categoryElement.querySelector<TagElement>("#" + req.body.id);
    const todos = categoryElement.querySelectorAll<TodoElement>("todo");

    todos.forEach((todo) => {
      todo.attributes.tags = todo.attributes.tags.filter((tagID) => {
        return tagElement.attributes.id !== tagID;
      });
    });

    categoryElement.removeChild(tagElement);
    res.send();
    database.save();
  } else {
    res.status(500).send("TAG__ID_IS_NOT_STRING");
  }
}

function createTag(req: TagPostRequest, res: Response, database: Database) {
  const category = database.getElementById(req.params.categoryID);

  const tag = database.createElement("tag", {
    id: generateHash(7),
    name: req.body.name,
    color: req.body.color,
    created: new Date().getTime(),
  } as TagResponse);

  if (category) {
    category.appendChild(tag);
    res.send(toTagResponse(tag));
    database.save();
  } else {
    res.status(404).send("CATEGORY_NOT_FOUND");
  }
}

function editTag(req: TagPostRequest, res: Response, database: Database) {
  const category = database.getElementById(req.params.categoryID);
  const tagElement = category && category.querySelector<TagElement>("#" + req.body.id);
  if (category && tagElement) {
    tagElement.setAttributes({
      name: tagElement.attributes.name || req.body.name,
      color: tagElement.attributes.color || req.body.color,
    });
    res.send(toTagResponse(tagElement));
    database.save();
  } else if (!category) {
    res.status(404).send("CATEGORY_NOT_FOUND");
  } else {
    res.status(404).send("TAG_NOT_FOUND");
  }
}

function onPost(req: TagPostRequest, res, database) {
  const validateQuery = new Validate({
    action: "create|delete|edit",
    "categoryID?": "string",
    "color?": "string",
    "id?": "string",
    "name?": "string",
  });

  if (validateQuery.validate(req.body).isValid) {
    if (req.body.action === "create") {
      createTag(req, res, database);
    } else if (req.body.action === "delete") {
      deleteTag(req, res, database);
    } else if (req.body.action === "edit") {
      editTag(req, res, database);
    }
  } else {
    res.status(404).send("TAG__INVALID_REQUEST");
  }
}

function onGet(req: TagGetRequest, res, database) {
  const selector = "#" + req.params.categoryID + " tag";
  const tagElements: TagResponse[] = database.body
    .querySelectorAll(selector)
    .map(toTagResponse);
  res.send(tagElements);
}

export const tagsRoute = function (database: Database, app: Express): express.Router {
  const router = express.Router();

  app.use("/tags", function (req, res, next) {
    req.params = path(req.url).params("/:categoryID");
    if (req.method === "POST") {
      onPost(req, res, database);
    } else if (req.method === "GET") {
      onGet(req, res, database);
    }
    next();
  });

  return router;
};