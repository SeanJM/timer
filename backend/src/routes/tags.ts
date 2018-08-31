import { Request, Response } from "express";
import Validate from "verified";
import Database from "@backend/class/database";
import generateHash from "@generate-hash";
import express from "express";
import { TagResponse } from "@types";
import Element from "@backend/class/element";

interface TagPostRequest extends Request {
  params: {
    categoryID: string;
  };
  query: {
    name: string;
    color: string;
  };
}

interface TagGetRequest extends Request {
  params: {
    categoryID: string;
  };
}

export function toTagResponse(tagElement: Partial<Element>): TagResponse {
  return {
    name: tagElement.attributes.name,
    id: tagElement.attributes.id,
    created: tagElement.attributes.created,
    color: tagElement.attributes.color,
  };
}

export default function (database: Database): express.Router {
  const router = express.Router();

  function createTag(req: TagPostRequest, res: Response) {
    const category = database.getElementById(req.params.categoryID)

    const tag = database.createElement("tag", {
      id: generateHash(7),
      name: req.query.name,
      color: req.query.color,
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

  router.get("/:categoryID", function (req: TagGetRequest, res: Response) {
    const selector = "#" + req.params.categoryID + " tag";
    const tagElements: TagResponse[] = database.body
      .querySelectorAll(selector)
      .map(toTagResponse);
    return res.send(tagElements);
  });

  router.post("/:categoryID", function (req: TagPostRequest, res: Response) {
    const queryV = new Validate({
      action: "create",
      color: "string",
      name: "string",
    });
    if (queryV.validate(req.query)) {
      createTag(req, res);
    }
  });

  return router;
}