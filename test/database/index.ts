import * as fs from "fs";
import * as path from "path";
import Database from "@backend/class/database";
import Validate from "verified";

fs.writeFileSync(path.resolve(__dirname, "test.json"), "");

const database = new Database(
  path.resolve(__dirname, "test.json")
);

export default function (test) {
  test("Database: createElement", function () {
    const element = database.createElement({
      id: "test",
      created: new Date().getTime(),
    }, [true]);

    return new Validate({
      type: "string",
      attributes: {
        id: "test",
        created: "number",
      },
      children: "any[]",
    }).validate(element).isValid;
  }).isEqual(true);

  test("Database: createElement", function () {
    const element = database.createElement("div", {
      id: "test",
      created: new Date().getTime(),
    }, [true]);

    return new Validate({
      type: "div",
      attributes: {
        id: "test",
        created: "number",
      },
      children: "any[]",
    }).validate(element).isValid;
  }).isEqual(true);

  test("Database: createElement (child is boolean)", function () {
    const element = database.createElement([false]);
    return new Validate({
      type: "element",
      children: "any[]",
      attributes: "object",
    }).validate(element).isValid
  }).isEqual(true);

  test("Database: persistence", function () {
    const db = new Database(
      path.resolve(__dirname, "../elements.json")
    );

    return new Validate({
      type: "category",
      attributes: {
        id: "0t5-4..$4p$7nhX9sK80zhwEuO8F.+Dg",
        "[string]?": "any",
      },
      "[string]?": "any",
    })
      .validate(db.getElementById("0t5-4..$4p$7nhX9sK80zhwEuO8F.+Dg")).isValid;
  }).isEqual(true);
}