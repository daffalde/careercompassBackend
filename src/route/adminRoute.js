import express from "express";
import { authToken } from "../middleware/authToken.js";
import { upload } from "../middleware/multer.js";
import {
  getData,
  handleDelete,
  handleLogin,
  handleProfil,
  handleRegister,
  handleUpdate,
} from "../controller/adminController.js";

export const routeAdmin = express.Router();

routeAdmin.get("/admin", getData);
routeAdmin.delete("/admin/:id", authToken, handleDelete);
routeAdmin.patch("/admin/:id", authToken, handleUpdate);
routeAdmin.patch(
  "/admin/profil/:id",
  authToken,
  upload.single("picture"),
  handleProfil
);
routeAdmin.post("/admin/register", handleRegister);
routeAdmin.post("/admin/login", handleLogin);
