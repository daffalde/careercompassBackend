import { pool } from "../db/db.js";
import "dotenv/config";
import { storage } from "../db/appwrite.js";
import { InputFile } from "node-appwrite/file";

export async function getData(req, res) {
  try {
    const resp = await pool.query("SELECT * FROM cv");
    res.json(resp.rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function insertData(req, res) {
  const { pelamar } = req.body;
  const link = req.file;

  const date = String(Date.now());
  try {
    await storage.createFile(
      process.env.APPWRITE_BUCKET,
      date,
      InputFile.fromBuffer(link.buffer, `${date}.pdf`)
    );

    const linkPath = `https://fra.cloud.appwrite.io/v1/storage/buckets/683faf7b00162513b232/files/${date}/view?project=682aeccf0023541588ed&mode=admin`;

    await pool.query(
      "INSERT INTO cv (nama,size,link,id_pelamar) VALUES ($1,$2,$3,$4)",
      [link.originalname, link.size, linkPath, pelamar]
    );

    res.json({ message: "Data ditambah" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function handleDelete(req, res) {
  const { id } = req.params;

  try {
    const resp = await pool.query("SELECT link FROM cv WHERE id_cv = $1", [id]);
    const fileId = resp.rows[0].link?.split("/")[8];
    if (fileId) {
      await storage.deleteFile(process.env.APPWRITE_BUCKET, fileId);
    }
    await pool.query("DELETE FROM cv WHERE id_cv = $1", [id]);
    res.json({ message: "data dihapus" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
