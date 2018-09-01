import express, { Request } from "express";
import Validate from "verified";
import Database from "@backend/class/database";
import generateHash from "@generate-hash";
import { CategoryElement, CategoryResponse, TodoElement, TagElement } from "@types";
import { toTodoResponse } from "@backend/routes/todo";
import { toTagResponse } from "@backend/routes/tags";

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

  database.save().then(() => {
    res.send(toCategoryResponse(element));
  });
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

export default function (database: Database, app) {
  const router = express.Router();

  app.post("/category/:categoryID", function (req: CategoryRequest, res, next) {
    const queryValidator =
      new Validate({
        "name?": "string",
        "action?": "delete|create",
        "[string]?": "string",
      });

    const isValidQuery =
      queryValidator.validate(req.query).isValid;

    if (isValidQuery) {
      if (req.query.action === "create") {
        createCategory(req, res, database);
      } else if (req.query.action === "delete") {
        deleteCategory(req, res, database);
      }
    } else {
      res.status(500).send("CATEGORY__INVALID_REQUEST");
    }
    next();
  });

  router.get("/all", function (req: Request, res) {
    res.send(
      database.body
        .querySelectorAll("#categories category")
        .map(toCategoryResponse)
    );
  });

  return router;
}