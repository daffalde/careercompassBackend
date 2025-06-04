import express from "express";
import {
  getData,
  handleDelete,
  handleLogin,
  handleProfil,
  handleRegister,
  handleUpdate,
} from "../controller/perusahaanController.js";
import { authToken } from "../middleware/authToken.js";
import { upload } from "../middleware/multer.js";

export const routePerusahaan = express.Router();

routePerusahaan.get("/perusahaan", getData);
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
