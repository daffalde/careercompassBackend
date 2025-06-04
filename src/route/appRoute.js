import express from "express";
import { authToken } from "../middleware/authToken.js";
import {
  getData,
  handleDelete,
  insertData,
  updateData,
} from "../controller/appController.js";

export const routeApp = express.Router();

routeApp.get("/app", authToken, getData);
routeApp.post("/app", authToken, insertData);
routeApp.patch("/app/:id", authToken, updateData);
routeApp.delete("/app/:id", authToken, handleDelete);
