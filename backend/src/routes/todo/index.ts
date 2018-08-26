import express from "express";
import Database from "@backend/class/database";
import todos from "@backend/routes/todo/todos";
import category from "@backend/routes/todo/category";


export default function (database: Database) {
  const router = express.Router();
  todos(router, database);
  category(router, database);
  return router;
}