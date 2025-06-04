import express from "express";
import cors from "cors";
import { routePelamar } from "./src/route/pelamarRoute.js";
import { routePerusahaan } from "./src/route/perusahaanRoute.js";
import { routerLowongan } from "./src/route/lowonganController.js";
import { routeTersimpan } from "./src/route/tersimpanRoute.js";
import { routeAdmin } from "./src/route/adminRoute.js";
import { routeCv } from "./src/route/cvRoute.js";
import { routeApp } from "./src/route/appRoute.js";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server online");
});

app.use("/auth", routePelamar);
app.use("/auth", routePerusahaan);
app.use("/auth", routeAdmin);
app.use("/data", routerLowongan);
app.use("/data", routeTersimpan);
app.use("/data", routeCv);
app.use("/data", routeApp);

app.listen(5000);
