import { Express } from "express";
import todo from "@routes/todo";
import tags from "@routes/tags";
import color from "@routes/color";
import Database from "@class/database";

export default function (app: Express, database: Database) {
  app.use("/todo", todo(database));
  app.use("/tags", tags(database));
  app.use("/color", color(database));
}