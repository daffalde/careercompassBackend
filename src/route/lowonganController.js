import express from "express";
import {
  getData,
  handleDelete,
  handleInsert,
  handleUpdate,
} from "../controller/lowonganController.js";
import { authToken } from "../middleware/authToken.js";

export const routerLowongan = express.Router();

routerLowongan.get("/lowongan", getData);
routerLowongan.post("/lowongan", authToken, handleInsert);
routerLowongan.patch("/lowongan/:id", authToken, handleUpdate);
routerLowongan.delete("/lowongan/:id", authToken, handleDelete);
