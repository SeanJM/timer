import { Express } from "express";
import todo from "./todo";

export default function (app: Express) {
  app.use("/todo", todo);
}