import { Express } from "express";
import todo from "@backend/routes/todo";
import tags from "@backend/routes/tags";
import color from "@backend/routes/color";
import Database from "@backend/class/database";

export default function (app: Express, database: Database) {
  app.use("/todo", todo(database));
  app.use("/tags", tags(database));
  app.use("/color", color(database));
}