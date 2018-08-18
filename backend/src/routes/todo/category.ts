import { Request } from "express";
import Validate from "verified";
import Database from "@class/database";
import generateHash from "@generate-hash";

export default function (router, database: Database) {
  router.post("/category", function (req: Request, res) {
    const v = new Validate({
      name: "string"
    });

    const element = database.createElement("category", {
      id: generateHash(16),
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

    console.log(req.query, categoriesElement, categoryElement);
    if (v.validate(req.query).isValid) {
      categoriesElement.removeChild(categoryElement);
      res.send();
      database.save();
    } else {
      res.status(500).send("TODO__INVALID_REQUEST");
    }
  });

  router.get("/category/all", function (req: Request, res) {
    console.log({
      props: {
        id: "category"
      }
    });
    res.send(
      database.getElementById("categories").children
    );
  });
}