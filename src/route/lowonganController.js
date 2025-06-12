import express from "express";
import {
  getAllData,
  getData,
  getDataId,
  handleDelete,
  handleInsert,
  handleUpdate,
} from "../controller/lowonganController.js";
import { authToken } from "../middleware/authToken.js";

export const routerLowongan = express.Router();

routerLowongan.get("/all-lowongan", getAllData);
routerLowongan.get("/lowongan", getData);
routerLowongan.get("/lowongan/:id", getDataId);
routerLowongan.post("/lowongan", authToken, handleInsert);
routerLowongan.patch("/lowongan/:id", authToken, handleUpdate);
routerLowongan.delete("/lowongan/:id", authToken, handleDelete);
