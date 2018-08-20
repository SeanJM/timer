import { Request, Response } from "express";
import Validate from "verified";
import Database from "@class/database";
import generateHash from "@generate-hash";

interface TagRequest extends Request {
  params: {
    categoryID: string;
  };
  query: {
    name: string;
    colorID: string;
  };
}

export default function (router, database: Database) {
  function createTag(req: TagRequest, res: Response) {
    const category = database.getElementById(req.params.categoryID)
    
    const tag = database.createElement("tag", {
      id: generateHash(7),
      name: req.query.name,
      colorID: req.query.colorID,
    });
    
    if (category) {
      category.appendChild(tag);
      res.send();
      database.save();
    } else {
      res.status(404).send("CATEGORY_NOT_FOUND");
    }
  }

  router.post("/tags/:categoryID", function (req: TagRequest, res: Response) {
    const queryV = new Validate({
      action: "create",
      colorID: "string",
      name: "string",
    });
    if (queryV.validate(req.query)) {
      createTag(req, res);
    }
  });
}