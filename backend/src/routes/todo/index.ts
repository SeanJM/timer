import express from "express";
import Database from "@backend/class/database";
import categoryID from "@backend/routes/todo/category-id";
import category from "@backend/routes/todo/category";


export default function (database: Database) {
  const router = express.Router();
  categoryID(router, database);
  category(router, database);
  return router;
}