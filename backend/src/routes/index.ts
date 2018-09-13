import { Express } from "express";
import todo from "@backend/routes/todo";
import category from "@backend/routes/category";
import { tagsRoute } from "@backend/routes/tags";
import color from "@backend/routes/color";
import { Database } from "@backend/class/database";

export function routes(app: Express, database: Database) {
  app.use("/category", category(database, app));
  app.use("/todo", todo(database, app));
  app.use("/tags", tagsRoute(database, app));
  app.use("/color", color(database));
}