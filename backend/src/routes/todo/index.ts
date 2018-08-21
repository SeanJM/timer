import express from "express";
import Database from "@class/database";
import categoryID from "@routes/todo/category-id";
import category from "@routes/todo/category";


export default function (database: Database) {
  const router = express.Router();
  categoryID(router, database);
  category(router, database);
  return router;
}