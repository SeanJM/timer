import { Response, Express } from "express";
import Validate from "verified";
import { Database } from "@backend/class/database";
import generateHash from "@generate-hash";
import { FilterResponse, FilterElement, CategoryElement } from "@types";
import path, { PathParams } from "@path";

interface FilterGetRequest {
  params: PathParams<{
    categoryID: string
  }>;
}

interface FilterPostRequest {
  body: {
    action: "create" | "delete" | "edit",
    name?: string,
    tags?: string[],
  };
  params: PathParams<{ categoryID: string, filterID: string }>;
}

export function toFilterResponse(element: FilterElement): FilterResponse {
  return {
    name: element.attributes.name,
    id: element.attributes.id,
    created: element.attributes.created,
    tags: element.attributes.tags,
  };
}

function createFilter(req: FilterPostRequest, res: Response, database: Database) {
  const { categoryID } = req.params;
  const category = database.getElementById(categoryID);

  const filterElement = database.createElement<FilterElement>("filter", {
    name: req.body.name,
    created: new Date().getTime(),
    id: generateHash(7),
    tags: []
  });

  if (category) {
    category.appendChild(filterElement);
    res.send(toFilterResponse(filterElement));
    database.save();
  } else {
    res
      .status(404)
      .send(`FILTERS__INVALID_CATEGORY_ID: "${categoryID}"`);
  }
}

function deleteFilter(req, res, database) {

}

function editFilter(req: FilterPostRequest, res, database) {
  const { categoryID, filterID } = req.params;
  const category: CategoryElement = database.getElementById(categoryID);
  const filterElement = category.querySelector<FilterElement>(`#${filterID}`);
  if (category && filterElement) {
    filterElement.setAttributes({
      name: req.body.name || filterElement.attributes.name,
      tags: req.body.tags || filterElement.attributes.tags,
    });

    res.send(toFilterResponse(filterElement));
    database.save();
  } else if (!filterElement) {
    res.status(404).send(`FILTERS__FILTER_ID_NOT_FOUND: "${filterID}"`);
  } else {
    res.status(404).send(`FILTERS__CATEGORY_ID_NOT_FOUND: "${categoryID}"`);
  }
}

function onPost(req: FilterPostRequest, res: Response, database) {
  const validateQuery = new Validate({
    action: "create|delete|edit",
    "name?": "string",
    "tags?": "string[]",
  });

  if (validateQuery.validate(req.body).isValid) {
    if (req.body.action === "create") {
      createFilter(req, res, database);
    } else if (req.body.action === "delete") {
      deleteFilter(req, res, database);
    } else if (req.body.action === "edit") {
      editFilter(req, res, database);
    }
  } else {
    res.status(500).send("TAG__INVALID_REQUEST");
  }
}

function onGet(req: FilterGetRequest, res: Response, database) {
  const filterElements: FilterResponse[] = database.body
    .querySelectorAll(`#${req.params.categoryID} filter`)
    .map(toFilterResponse);
  res.send(filterElements);
}

export function filters(database: Database, app: Express) {
  app.use("/filters", function (req, res, next) {
    req.params = path(req.url).params("/:categoryID/:filterID");
    if (req.method === "POST") {
      onPost(req, res, database);
    } else if (req.method === "GET") {
      onGet(req, res, database);
    }
    next();
  });
}