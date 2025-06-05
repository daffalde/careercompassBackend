import { pool } from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { storage } from "../db/appwrite.js";
import { InputFile } from "node-appwrite/file";

export async function getData(req, res) {
  try {
    const resp = await pool.query(
      "SELECT id_pelamar, email,role, nama_pelamar, profil, spesialis, lokasi, provinsi, tentang, skill, created_at FROM pelamar"
    );
    res.json(resp.rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function getDataId(req, res) {
  const { id } = req.params;
  try {
    const resp = await pool.query(
      "SELECT id_pelamar, email,role, nama_pelamar, profil, spesialis, lokasi, provinsi, tentang, skill, created_at FROM pelamar WHERE id_pelamar = $1",
      [id]
    );
    res.json(resp.rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function handleDelete(req, res) {
  const { id } = req.params;

  try {
    const resp = await pool.query(
      "SELECT profil FROM pelamar WHERE id_pelamar = $1",
      [id]
    );
    const fileId = resp.rows[0].profil?.split("/")[8];
    if (fileId) {
      await storage.deleteFile(process.env.APPWRITE_BUCKET, fileId);
    }
    await pool.query("DELETE FROM pelamar WHERE id_pelamar = $1", [id]);
    res.json({ message: "data dihapus" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function handleUpdate(req, res) {
  const { id } = req.params;
  const { nama, spesialis, lokasi, provinsi, tentang, skill } = req.body;

  try {
    await pool.query(
      "UPDATE pelamar SET nama_pelamar = COALESCE($1, nama_pelamar),spesialis = COALESCE($2, spesialis),lokasi = COALESCE($3, lokasi),provinsi = COALESCE($4, provinsi),tentang = COALESCE($5, tentang),skill = COALESCE($6, skill) WHERE id_pelamar = $7",
      [(nama, spesialis, lokasi, provinsi, tentang, skill, id)]
    );
    res.json({ message: "data diubah" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function handleProfil(req, res) {
  const picture = req.file;
  const { id } = req.params;

  const date = String(Date.now());

  try {
    const resp = await pool.query(
      "SELECT profil FROM pelamar WHERE id_pelamar = $1",
      [id]
    );
    const fileId = resp.rows[0].profil?.split("/")[8];
    if (fileId) {
      await storage.deleteFile(process.env.APPWRITE_BUCKET, fileId);
    }
    await storage.createFile(
      process.env.APPWRITE_BUCKET,
      date,
      InputFile.fromBuffer(
        picture.buffer,
        `${date}.${picture.originalname.split(".")[1]}`
      )
    );

    const picturePath = `https://fra.cloud.appwrite.io/v1/storage/buckets/683faf7b00162513b232/files/${date}/view?project=682aeccf0023541588ed&mode=admin`;

    await pool.query("UPDATE pelamar SET profil = $1 WHERE id_pelamar = $2", [
      picturePath,
      id,
    ]);

    res.json({ message: "Foto profil diubah" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function handleRegister(req, res) {
  const { name, email, password } = req.body;
  const hashPass = await bcrypt.hash(password, 10);

  try {
    const resp = await pool.query("SELECT * FROM pelamar WHERE email = $1", [
      email,
    ]);
    if (resp.rowCount != 0)
      return res.status(409).json({ message: "data sudah ada" });
    await pool.query(
      "INSERT INTO pelamar (email,password,nama_pelamar) VALUES ($1,$2,$3)",
      [email, hashPass, name]
    );
    res.json({ message: "register berhasil" });
  } catch (e) {
    res.status(500).json({ message: e });
  }
}

export async function handleLogin(req, res) {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM pelamar WHERE email = $1", [
      email,
    ]);
    if (result.rowCount === 0)
      return res.status(401).json({ message: "email tidak ditemukan" });
    const resp = await pool.query(
      "SELECT id_pelamar, role FROM pelamar WHERE email = $1",
      [email]
    );

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "password salah" });

    const token = jwt.sign(
      { id: user.id_pelamar, email: user.email },
      process.env.JWT_TOKEN
    );
    res.json({ token: token, data: resp.rows });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
