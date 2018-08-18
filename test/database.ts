import * as fs from "fs";
import * as path from "path";
import Database from "../backend/src/class/database";
import querySelectorToObject from "@query-selector-to-object";
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

  test("Database: appendChild", function () {
    const a = database.createElement("div");
    const b = database.createElement("span");
    const body = database.body;
    body.appendChild(a);
    a.appendChild(b);
    return body.children.indexOf(a) > -1 && a.children.indexOf(b) > -1;
  }).isEqual(true);

  test("Database: appendChild as string", function () {
    const element = database.body.appendChild("Child");
    return element.children.find(a => a === "Child");
  }).isEqual("Child");

  test("Database: find", function () {
    const validator = new Validate({
      type: "element",
      attributes: {
        id: "bnm"
      },
      children: "any[]",
      parentNode: "object",
    });

    database.body.appendChild(
      database.createElement({ id: "76l" })
    );

    database.body.appendChild(
      database.createElement({ id: "bnm" })
    );

    database.body.appendChild(
      database.createElement({ id: "9jh" })
    );

    database.body.appendChild(
      database.createElement({ id: "76h" })
    );

    return validator.validate(database.find("#bnm")).isValid;
  }).isEqual(true);

  test("Database: removeChild", function () {
    let a = database.createElement("div", { id: "98a" });
    let b = database.createElement("div", { id: "071k" });
    database.body.appendChild(a);
    database.body.appendChild(b);
    database.body.removeChild(b);
    return database.find("#071k") === null && !!database.find("#98a");
  }).isEqual(true);

  test("Database: setAttirbute", function () {
    let a = database.createElement("div", { id: "98a" });
    a.setAttributes("created", new Date().getTime());
    a.setAttributes("id", "someId");
    return new Validate({ created: "number", id: "string" }).validate(a.attributes).isValid;
  }).isEqual(true);

  test("Database: queryStringToObject ID", function () {
    const a = querySelectorToObject("#bnm");
    return a;
  }).isDeepEqual({
    attributes: { id: "bnm" }
  });

  test("Database: queryStringToObject className", function () {
    const a = querySelectorToObject(".todo");
    return a;
  }).isDeepEqual({
    attributes: { className: "todo" }
  });

  test("Database: persistence", function () {
    const db = new Database(
      path.resolve(__dirname, "elements.json")
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

  test("Database: persistence, remove child", function () {
    const db = new Database(
      path.resolve(__dirname, "elements.json")
    );

    const categories = db.getElementById("categories");
    const category = db.getElementById("0t5-4..$4p$7nhX9sK80zhwEuO8F.+Dg");
    categories.removeChild(category);
    return categories.children.indexOf(category) === -1;
  }).isEqual(true);
}