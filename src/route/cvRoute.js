import express from "express";
import { authToken } from "../middleware/authToken.js";
import { upload } from "../middleware/multer.js";
import {
  getData,
  handleDelete,
  insertData,
} from "../controller/cvController.js";

export const routeCv = express.Router();

routeCv.get("/cv", authToken, getData);
routeCv.delete("/cv/:id", authToken, handleDelete);
routeCv.post("/cv", authToken, upload.single("link"), insertData);
