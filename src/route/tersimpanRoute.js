import express from "express";
import {
  getDataLowongan,
  getDataPerusahaan,
  handleDeleteLowongan,
  handleDeletePerusahaan,
  handleInsertLowongan,
  handleInsertPerusahaan,
} from "../controller/tersimpanController.js";
import { authToken } from "../middleware/authToken.js";

export const routeTersimpan = express.Router();

routeTersimpan.get("/lowongan-tersimpan", authToken, getDataLowongan);
routeTersimpan.post("/lowongan-tersimpan", authToken, handleInsertLowongan);
routeTersimpan.delete(
  "/lowongan-tersimpan/:id",
  authToken,
  handleDeleteLowongan
);

routeTersimpan.get("/perusahaan-tersimpan", authToken, getDataPerusahaan);
routeTersimpan.post("/perusahaan-tersimpan", authToken, handleInsertPerusahaan);
routeTersimpan.delete(
  "/perusahaan-tersimpan/:id",
  authToken,
  handleDeletePerusahaan
);
