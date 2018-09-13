import * as fs from "fs";
import * as path from "path";
import { Database } from "@backend/class/database";

fs.writeFileSync(path.resolve(__dirname, "test.json"), "");

const database = new Database(
  path.resolve(__dirname, "test.json")
);

export default function (test) {
  test("Element: querySelectorAll (tag)", function () {
    const parentNode = database.createElement();

    const tags = [
      database.createElement("tag", { className: "test" }),
      database.createElement("tag", { className: "test" })
    ];

    let res;

    parentNode
      .appendChild(
        database.createElement({ id: "76l" })
      )
      .appendChild(
        database.createElement({ id: "bnm" })
      )
      .appendChild(
        tags[0]
      )
      .appendChild(
        tags[1]
      )
      .appendChild(
        database.createElement()
      );

    res = parentNode.querySelectorAll("tag");

    return (
      res[0] === tags[0] &&
      res[1] === tags[1]
    );
  }).isEqual(true);

  test("Element: querySelectorAll variable nesting (tag)", function () {
    const parentNode = database.createElement();

    const tags = [
      database.createElement("tag", { className: "test" }),
      database.createElement("tag", { className: "test" })
    ];

    let res;

    parentNode
      .appendChild(
        database.createElement({ id: "76l" })
      )
      .appendChild(
        database.createElement({ id: "bnm" })
      )
      .appendChild(
        database.createElement().appendChild(
          tags[0]
        )
      )
      .appendChild(
        tags[1]
      )
      .appendChild(
        database.createElement()
      );

    res = parentNode.querySelectorAll("tag");

    return (
      res[0] === tags[0] &&
      res[1] === tags[1]
    );
  }).isEqual(true);
}