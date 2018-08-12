import * as path from "path";
import express, { Request } from "express";
import Validate from "verified";
import Database, { DatabaseNode } from "@class/database";
import generateId from "@generate-id";

const router = express.Router();
const db = new Database(
  path.resolve(__dirname, "../../database.json")
);

router.get("/", function (req, res) {
  console.log(req);
  res.send();
});

router.post("/category", function (req: Request, res) {
  const v = new Validate({
    name: "string"
  });

  if (v.validate(req.query).isValid) {
    db.appendChild(["category"], {
      name: req.query.name
    })
      .then((category) => {
        res.send(category);
      });
  } else {
    res.status(500).send("TODO__INVALID_REQUEST");
  }
});

router.post("/category/:categoryID", function (req: Request, res) {
  const v = new Validate({
    "name?": "string",
    "id?": "string",
    action: "create|delete|complete",
  });

  const todo: DatabaseNode = {
    id: generateId(),
    name: req.query.name,
  };

  if (v.validate(req.query).isValid) {
    if (req.query.action === "create") {
      db.appendChild(["category", req.params.categoryID], todo.id)
        .then((child) => {
          res.send(child);
        });
    } else if (req.query.action === "delete") {
      db.pop(["category", req.params.categoryID, req.query.id]);
    } else if (req.query.action === "complete") {
      db.set(["category", req.params.categoryID, req.query.id], {
        status: "complete"
      });
    }
  } else {
    res.status(500).send("TODO__INVALID_REQUEST");
  }
});

router.delete("/category", function (req: Request, res) {
  const v = new Validate({
    id: "string"
  });

  if (v.validate(req.query).isValid) {
    db.deleteByID("category", req.query.id)
      .then((category) => {
        res.send(category);
      });
  } else {
    res.status(500).send("TODO__INVALID_REQUEST");
  }
});

router.get("/categories", function (req: Request, res) {
  res.send(db.get(["category"]).children);
});

export default router;