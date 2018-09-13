import express, { Request, Express } from "express";
import Validate from "verified";
import { Database } from "@backend/class/database";
import generateHash from "@generate-hash";
import { CategoryElement, CategoryResponse, TodoElement, TagElement } from "@types";
import { toTodoResponse } from "@backend/routes/todo";
import { toTagResponse } from "@backend/routes/tags";
import path from "@path";

interface CategoryRequestParams {
  categoryID: string;
}

interface CategoryRequestQuery {
  name: string;
  action?: "create" | "delete";
}

interface CategoryRequest extends Request {
  params: CategoryRequestParams;
  query: CategoryRequestQuery;
  url: string;
  method: "POST" | "GET";
}

function toCategoryResponse(element: CategoryElement): CategoryResponse {
  const todoElements = (element.querySelectorAll("todo") as TodoElement[]);
  const tagElements = (element.querySelectorAll("tag") as TagElement[]);
  return {
    id: element.attributes.id,
    created: element.attributes.created,
    name: element.attributes.name,
    todos: todoElements.map(toTodoResponse),
    tags: tagElements.map(toTagResponse),
  };
}

function createCategory(req: CategoryRequest, res, database: Database) {
  const element = database.createElement<CategoryElement>("category", {
    id: generateHash(12),
    name: req.query.name,
  });

  database
    .getElementById("categories")
    .appendChild(element);

  res.send(toCategoryResponse(element));
  database.save();
}

function deleteCategory(req: CategoryRequest, res, database: Database) {
  let categoryElement =
      database.getElementById(req.params.categoryID);

  let categoriesElement =
    database.getElementById("categories");

  categoriesElement.removeChild(categoryElement);
  res.send();
  database.save();
}

function onPost(req: CategoryRequest, res, database: Database) {
  const queryValidator =
    new Validate({
      "name?": "string",
      "action": "delete|create",
      "[string]?": "string",
    });

  const isValidQuery =
    queryValidator.validate(req.query).isValid;

  req.params =
    path(req.url).params("/:categoryID");

  if (isValidQuery) {
    if (req.query.action === "create") {
      createCategory(req, res, database);
    } else if (req.query.action === "delete") {
      deleteCategory(req, res, database);
    }
  } else {
    res.status(500).send("CATEGORY__INVALID_REQUEST");
  }
}

function onGet(req: CategoryRequest, res, database: Database) {
  if (req.params.categoryID === "all") {
    res.send(
      database.body
        .querySelectorAll("#categories category")
        .map(toCategoryResponse)
    );
  }
}

export default function (database: Database, app: Express) {
  const router = express.Router();

  app.use("/category", function (req: CategoryRequest, res, next) {
    req.params =
      path(req.url).params("/:categoryID");

    if (req.method === "POST") {
      onPost(req, res, database);
    } else if (req.method === "GET") {
      onGet(req, res, database);
    }

    next();
  });

  return router;
}