import * as fs from "fs";
import * as path from "path";
import Database from "@backend/class/database";
import Validate from "verified";

fs.writeFileSync(path.resolve(__dirname, "test.json"), "");

const database = new Database(
  path.resolve(__dirname, "test.json")
);

export default function (test) {
  test("Element: querySelector (#9jh tag)", function () {
    const validator = new Validate({
      type: "tag",
      attributes: {
        id: "72h"
      },
      children: "any[]",
      parentNode: "object",
    });

    let parentElement = database.createElement({ id: "9jh" });

    database.body.appendChild(
      database.createElement({ id: "76l" })
    );

    database.body.appendChild(
      database.createElement({ id: "bnm" })
    );

    database.body.appendChild(
      parentElement
    );

    parentElement.appendChild(
      database.createElement({ id: "76h" })
    );

    parentElement.appendChild(
      database.createElement("tag", { id: "72h" })
    );

    parentElement.appendChild(
      database.createElement({ id: "1ef" })
    );

    return validator.validate(database.body.querySelector("#9jh tag")).isValid;
  }).isEqual(true);

  test("Element: querySelector with skipping parent (#9jh tag)", function () {
    const validator = new Validate({
      type: "tag",
      attributes: {
        id: "72h"
      },
      children: "any[]",
      parentNode: "object",
    });

    let parentElement = database.createElement({ id: "9jh" });
    let childElement = database.createElement({id : "kj7" });

    database.body.appendChild(
      database.createElement({ id: "76l" })
    );

    database.body.appendChild(
      database.createElement({ id: "bnm" })
    );

    database.body.appendChild(
      parentElement
    );

    parentElement.appendChild(childElement);

    childElement.appendChild(
      database.createElement({ id: "76h" })
    );

    childElement.appendChild(
      database.createElement("tag", { id: "72h" })
    );

    childElement.appendChild(
      database.createElement({ id: "1ef" })
    );

    return validator.validate(database.body.querySelector("#9jh tag")).isValid;
  }).isEqual(true);

  test("Element: querySelector with deep parents (.parent .class tag)", function () {
    const validator = new Validate({
      type: "tag",
      attributes: {
        className: "class"
      },
      children: "any[]",
      parentNode: "object",
    });

    let childElement = database.createElement();
    let tagElement = database.createElement("tag", { className: "class" });

    database.body.appendChild(
      database.createElement()
        .appendChild(
          database.createElement({
            className: "parent"
          })
            .appendChild(childElement
              .appendChild(database.createElement()
              .appendChild(database.createElement({ className: "class" })
                .appendChild(database.createElement()
                  .appendChild(tagElement)
                )
              )
            )
          )
        )
    );
    return validator.validate(database.body.querySelector(".parent .class tag")).isValid;
  }).isEqual(true);
}