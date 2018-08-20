import express from "express";
import Database from "@class/database";
import categoryID from "@routes/todo/category-id";
import category from "@routes/todo/category";
import tags from "@routes/todo/tags";


export default function (database: Database) {
  const router = express.Router();
  categoryID(router, database);
  category(router, database);
  tags(router, database);
  return router;
}