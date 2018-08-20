import * as fs from "fs";
import * as path from "path";
import Database from "@class/database";
import Validate from "verified";

fs.writeFileSync(path.resolve(__dirname, "test.json"), "");

const database = new Database(
  path.resolve(__dirname, "test.json")
);

export default function (test) {
  test("Element: appendChild", function () {
    const a = database.createElement("div");
    const b = database.createElement("span");
    const body = database.body;
    body.appendChild(a);
    a.appendChild(b);
    return body.children.indexOf(a) > -1 && a.children.indexOf(b) > -1;
  }).isEqual(true);

  test("Element: appendChild as string", function () {
    const element = database.body.appendChild("Child");
    return element.children.find(a => a === "Child");
  }).isEqual("Child");

  test("Element: removeChild", function () {
    let a = database.createElement("div", { id: "98a" });
    let b = database.createElement("div", { id: "071k" });
    database.body.appendChild(a);
    database.body.appendChild(b);
    database.body.removeChild(b);
    return (
      database.body.querySelector("#071k") === null && 
      !!database.body.querySelector("#98a")
    );
  }).isEqual(true);

  test("Element: setAttirbute", function () {
    let a = database.createElement("div", { id: "98a" });
    a.setAttributes("created", new Date().getTime());
    a.setAttributes("id", "someId");
    return new Validate({ created: "number", id: "string" }).validate(a.attributes).isValid;
  }).isEqual(true);
}