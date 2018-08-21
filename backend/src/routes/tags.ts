import { Request, Response } from "express";
import Validate from "verified";
import Database from "@class/database";
import generateHash from "@generate-hash";
import express from "express";
import { TagNode } from "@store";
import Element from "@class/element";

interface TagPostRequest extends Request {
  params: {
    categoryID: string;
  };
  query: {
    name: string;
    colorID: string;
  };
}

interface TagGetRequest extends Request {
  params: {
    categoryID: string;
  };
}

export default function (database: Database): express.Router {
  const router = express.Router();

  function createTag(req: TagPostRequest, res: Response) {
    const category = database.getElementById(req.params.categoryID)
    
    const tag = database.createElement("tag", {
      id: generateHash(7),
      name: req.query.name,
      colorID: req.query.colorID,
      created: new Date().getTime(),
    });
    
    if (category) {
      category.appendChild(tag);
      res.send();
      database.save();
    } else {
      res.status(404).send("CATEGORY_NOT_FOUND");
    }
  }

  function toTagResponse(tagElement: Partial<Element>): TagNode {
    return {
      name: tagElement.attributes.name,
      id: tagElement.attributes.id,
      created: tagElement.attributes.created,
      colorID: tagElement.attributes.colorID,
    };
  }

  router.get("/:categoryID", function (req: TagGetRequest, res: Response) {
    const selector = "#" + req.params.categoryID + " tag";

    const tagElements: TagNode[] = 
      database.body
        .querySelectorAll(selector)
        .map(toTagResponse);

    return res.send(tagElements);
  });

  router.post("/:categoryID", function (req: TagPostRequest, res: Response) {
    const queryV = new Validate({
      action: "create",
      colorID: "string",
      name: "string",
    });
    if (queryV.validate(req.query)) {
      createTag(req, res);
    }
  });

  return router;
}