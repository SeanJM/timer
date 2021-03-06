import { Request, Response } from "express";
import Validate from "verified";
import { Database } from "@backend/class/database";
import generateHash from "@generate-hash";
import express from "express";
import { DatabaseElement } from "@backend/class/element";

interface PalettePostRequest extends Request {
  params: {
    categoryID: string;
  };
  body: {
    action: "create" | "delete",
    value?: string;
    id?: string;
  };
}

interface SwatchAttributes {
  value: string;
  created: number;
  id: string;
}

interface SwatchElement extends DatabaseElement {
  tagName: "swatch";
  attributes: SwatchAttributes;
}

function toSwatchResponse(swatch: SwatchElement) {
  return swatch.attributes;
}

export function color(database: Database): express.Router {
  const router = express.Router();

  function createSwatch(req, res) {
    const color = database.body.querySelector("#color");

    const swatch = database.createElement("swatch", {
      value: req.query.value,
      created: new Date().getTime(),
      id: generateHash(),
    } as SwatchAttributes) as SwatchElement;

    color.appendChild(swatch);
    res.send(toSwatchResponse(swatch));
    database.save();
  }

  function deleteSwatch(req: PalettePostRequest, res) {
    const color = database.body.querySelector("#color");
    const swatch = color.querySelector("#" + req.body.id);
    color.removeChild(swatch);
    res.send();
    database.save();
  }

  router.post("/palette", function (req: PalettePostRequest, res: Response) {
    const v = new Validate({
      action: "create|delete",
      value: "string",
      "id?": "string",
    });

    if (v.validate(req.body)) {
      if (req.body.action === "create") {
        createSwatch(req, res);
      } else if (req.body.action === "delete") {
        deleteSwatch(req, res);
      }
    }
  });

  router.get("/palette", function (req: Request, res: Response) {
    res.send(database.body.querySelector("#color").children.map(toSwatchResponse));
  });

  return router;
}