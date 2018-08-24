import { Request, Response } from "express";
import Validate from "verified";
import Database from "@class/database";
import generateHash from "@generate-hash";
import express from "express";
import Element from "@class/element";

interface PalettePostRequest extends Request {
  params: {
    categoryID: string;
  };
  query: {
    action: "create",
    value: string;
  };
}

interface SwatchAttributes {
  value: string;
  created: number;
  id: string;
}

interface SwatchElement extends Element {
  type: "swatch";
  attributes: SwatchAttributes;
}

function mapSwatchToResponse(swatch: SwatchElement) {
  return swatch.attributes;
}

export default function (database: Database): express.Router {
  function createSwatch(req, res) {
    const color = database.body.querySelector("#color");

    const swatch = database.createElement("swatch", {
      value: req.query.value,
      created: new Date().getTime(),
      id: generateHash(),
    } as SwatchAttributes) as SwatchElement;

    color.appendChild(swatch);
    return res.send(mapSwatchToResponse(swatch));
  }
  const router = express.Router();

  router.post("/palette", function (req: PalettePostRequest, res: Response) {
    const v = new Validate({
      action: "create",
      value: "string"
    });

    if (v.validate(req.query)) {
      createSwatch(req, res);
    }
  });

  return router;
}