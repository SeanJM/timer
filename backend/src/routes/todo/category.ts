import { Request } from "express";
import Validate from "verified";
import Database from "@backend/class/database";
import generateHash from "@generate-hash";
import { CategoryElement, CategoryResponse, TodoElement, TagElement } from "@types";
import { toTodoResponse } from "./todos";
import { toTagResponse } from "@backend/routes/tags";

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

export default function (router, database: Database) {
  router.post("/category", function (req: Request, res) {
    const v = new Validate({
      name: "string"
    });

    const element = database.createElement<CategoryElement>("category", {
      id: generateHash(12),
      name: req.query.name,
    });

    if (v.validate(req.query).isValid) {
      database
        .getElementById("categories")
        .appendChild(element);
      database.save().then(() => {
        res.send(toCategoryResponse(element));
      });
    } else {
      res.status(500).send("TODO__INVALID_REQUEST");
    }
  });

  router.delete("/category", function (req: Request, res) {
    let categoryElement =
      database.getElementById(req.query.id);

    let categoriesElement =
      database.getElementById("categories");

    const v = new Validate({
      id: "string"
    });

    if (v.validate(req.query).isValid) {
      categoriesElement.removeChild(categoryElement);
      res.send();
      database.save();
    } else {
      res.status(500).send("TODO__INVALID_REQUEST");
    }
  });

  router.get("/category/all", function (req: Request, res) {
    res.send(
      database.body
        .querySelectorAll("#categories category")
        .map(toCategoryResponse)
    );
  });
}