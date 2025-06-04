import express from "express";
import {
  getData,
  handleDelete,
  handleLogin,
  handleProfil,
  handleRegister,
  handleUpdate,
} from "../controller/pelamarController.js";
import { authToken } from "../middleware/authToken.js";
import { upload } from "../middleware/multer.js";

export const routePelamar = express.Router();

routePelamar.get("/pelamar", getData);
routePelamar.delete("/pelamar/:id", authToken, handleDelete);
routePelamar.patch("/pelamar/:id", authToken, handleUpdate);
routePelamar.patch(
  "/pelamar/profil/:id",
  authToken,
  upload.single("picture"),
  handleProfil
);
routePelamar.post("/pelamar/register", handleRegister);
routePelamar.post("/pelamar/login", handleLogin);
