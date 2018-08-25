import "source-map-support/register"
import * as path from "path";
import bodyParser = require("body-parser");
import express = require("express");
import routes from "@routes";
import page from "@page";
import Database from "@class/database";

const __root = path.join(__dirname, "../../");
const app = express();
const port = 3005;

const database = new Database(
  path.resolve(__dirname, "../database.json")
);

if (!database.getElementById("categories")) {
  database.body.appendChild(database.createElement({
    id: "categories",
    created: new Date().getTime(),
  }));

  database.body.appendChild(database.createElement({
    id: "color",
    created: new Date().getTime(),
  }));
}

page(__root);

routes(app, database);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/", express.static(path.resolve(__root, "frontend/public/")));
app.listen(port);
console.log("Proxy is running on http://localhost:" + port);