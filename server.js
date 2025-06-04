import express from "express";
import cors from "cors";
import { routePelamar } from "./src/route/pelamarRoute.js";
import { routePerusahaan } from "./src/route/perusahaanRoute.js";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server online");
});

app.use("/auth", routePelamar);
app.use("/auth", routePerusahaan);

app.listen(5000);
