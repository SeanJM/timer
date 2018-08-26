import { Request } from "express";
import Validate from "verified";
import Database from "@backend/class/database";
import generateHash from "@generate-hash";
import { CategoryElement, CategoryResponse, TodoElement } from "@types";
import { toTodoResponse } from "./todos";

function toCategoryResponse(element: CategoryElement): CategoryResponse {
  const todoElements = (element.querySelectorAll("todo") as TodoElement[]);
  return {
    id: element.attributes.id,
    created: element.attributes.created,
    name: element.attributes.name,
    todos: todoElements.map(toTodoResponse),
  };
}

export default function (router, database: Database) {
  router.post("/category", function (req: Request, res) {
    const v = new Validate({
      name: "string"
    });

    const element = database.createElement("category", {
      id: generateHash(6),
      name: req.query.name,
    });

    if (v.validate(req.query).isValid) {
      database
        .getElementById("categories")
        .appendChild(element);
      database.save().then(() => {
        res.send(element);
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