import express, { Request, Express, Response } from "express";
import Validate from "verified";
import { Database } from "@backend/class/database";
import generateHash from "@generate-hash";

import {
  CategoryAllResponse,
  CategoryElement,
  CategoryFilterBy,
  CategoryResponse,
  CategorySortBy,
  FilterElement,
  TagElement,
  TodoElement,
} from "@types";

import { toTodoResponse } from "@backend/routes/todo";
import { toTagResponse } from "@backend/routes/tags";
import { toFilterResponse } from "@backend/routes/filters";
import path from "@path";

interface CategoryRequestParams {
  categoryID: string;
}

interface CategoryRequestQuery {
  name: string;
  sortBy?: CategorySortBy;
  filterBy?: CategoryFilterBy;
  action?:
    | "create"
    | "delete"
    | "filter"
    | "sort"
    ;
}

interface CategoryRequest extends Request {
  params: CategoryRequestParams;
  body: CategoryRequestQuery;
  url: string;
  method: "POST" | "GET";
}

function toCategoryResponse(element: CategoryElement): CategoryResponse {
  const todoElements = element.querySelectorAll<TodoElement>("todo");
  const tagElements = element.querySelectorAll<TagElement>("tag");
  const filterElements = element.querySelectorAll<FilterElement>("filter");
  return {
    sortBy: element.attributes.sortBy,
    filterBy: element.attributes.filterBy,
    id: element.attributes.id,
    created: element.attributes.created,
    name: element.attributes.name,
    todos: todoElements.map(toTodoResponse),
    tags: tagElements.map(toTagResponse),
    filters: filterElements.map(toFilterResponse),
  };
}

function createCategory(req: CategoryRequest, res, database: Database) {
  const element = database.createElement<CategoryElement>("category", {
    sortBy: "date",
    filterBy: null,
    created: new Date().getTime(),
    id: generateHash(12),
    name: req.body.name,
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

function sortCategory(req: CategoryRequest, res: Response, database: Database) {
  let categoryElement = database.getElementById<CategoryElement>(req.params.categoryID);
  if (categoryElement) {
    categoryElement.setAttributes({
      sortBy: req.body.sortBy
    });
    database.save();
    res.send();
  } else {
    res
      .status(404)
      .send(`CATEGORY__NOT_FOUND: "${req.params.categoryID}"`);
  }
}

function filterCategory(req: CategoryRequest, res: Response, database: Database) {
  let categoryElement = database.getElementById<CategoryElement>(req.params.categoryID);
  if (categoryElement) {
    categoryElement.setAttributes({
      filterBy: req.body.filterBy
    });
    database.save();
    res.send();
  } else {
    res
      .status(404)
      .send(`CATEGORY__NOT_FOUND: "${req.params.categoryID}"`);
  }
}

function onPost(req: CategoryRequest, res, database: Database) {
  const bodyValidator =
    new Validate({
      "name?": "string",
      "action": `
        | create
        | delete
        | filter
        | sort
        `,
      "[string]?": "string | null",
    });

  const isValidQuery =
    bodyValidator.validate(req.body).isValid;

  req.params =
    path(req.url).params("/:categoryID");

  if (isValidQuery) {
    if (req.body.action === "create") {
      createCategory(req, res, database);
    } else if (req.body.action === "delete") {
      deleteCategory(req, res, database);
    } else if (req.body.action === "sort") {
      sortCategory(req, res, database);
    } else if (req.body.action === "filter") {
      filterCategory(req, res, database);
    }
  } else {
    res.status(500).send("CATEGORY__INVALID_REQUEST");
  }
}

function onGet(req: CategoryRequest, res, database: Database) {
  if (req.params.categoryID === "all") {
    res.send({
      todoSettings:
        database.getElementById("todoSettings").attributes,
      categories:
        database.body
          .querySelectorAll("#categories category")
          .map(toCategoryResponse)
    } as CategoryAllResponse);
  }
}

export function category(database: Database, app: Express) {
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