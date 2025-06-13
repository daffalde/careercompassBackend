import express from "express";
import {
  getAllData,
  getData,
  handleDelete,
  handleLogin,
  handleProfil,
  handleRegister,
  handleUpdate,
  selectData,
} from "../controller/perusahaanController.js";
import { authToken } from "../middleware/authToken.js";
import { upload } from "../middleware/multer.js";

export const routePerusahaan = express.Router();

routePerusahaan.get("/all-perusahaan", getAllData);
routePerusahaan.get("/perusahaan", getData);
routePerusahaan.get("/perusahaan/:id", selectData);
routePerusahaan.delete("/perusahaan/:id", authToken, handleDelete);
routePerusahaan.patch("/perusahaan/:id", authToken, handleUpdate);
routePerusahaan.patch(
  "/perusahaan/profil/:id",
  authToken,
  upload.single("picture"),
  handleProfil
);
routePerusahaan.post("/perusahaan/register", handleRegister);
routePerusahaan.post("/perusahaan/login", handleLogin);
