import { pool } from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { storage } from "../db/appwrite.js";
import { InputFile } from "node-appwrite/file";

export async function getData(req, res) {
  try {
    const resp = await pool.query(
      "SELECT id_perusahaan, email,role, nama_perusahaan, picture, situs, tahun_didirikan, bidang, karyawan, lokasi,provinsi,tentang,visi,misi, created_at FROM perusahaan"
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
      "SELECT picture FROM perusahaan WHERE id_perusahaan = $1",
      [id]
    );
    const fileId = resp.rows[0].picture?.split("/")[8];
    if (fileId) {
      await storage.deleteFile(process.env.APPWRITE_BUCKET, fileId);
    }
    await pool.query("DELETE FROM perusahaan WHERE id_perusahaan = $1", [id]);
    res.json({ message: "data dihapus" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function handleUpdate(req, res) {
  const { id } = req.params;
  const {
    nama,
    situs,
    tahun,
    bidang,
    karyawan,
    lokasi,
    provinsi,
    tentang,
    visi,
    misi,
  } = req.body;

  try {
    await pool.query(
      "UPDATE perusahaan SET nama_perusahaan = $1, situs = $2, tahun_didirikan = $3, bidang = $4, karyawan = $5, lokasi = $6,provinsi = $7,tentang = $8,visi = $9,misi = $10 WHERE id_perusahaan = $11",
      [
        nama,
        situs,
        tahun,
        bidang,
        karyawan,
        lokasi,
        provinsi,
        tentang,
        visi,
        misi,
        id,
      ]
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
      "SELECT picture FROM perusahaan WHERE id_perusahaan = $1",
      [id]
    );
    const fileId = resp.rows[0].picture?.split("/")[8];
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

    await pool.query(
      "UPDATE perusahaan SET picture = $1 WHERE id_perusahaan = $2",
      [picturePath, id]
    );

    res.json({ message: "Foto profil diubah" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function handleRegister(req, res) {
  const { name, email, password } = req.body;
  const hashPass = await bcrypt.hash(password, 10);

  try {
    const resp = await pool.query("SELECT * FROM perusahaan WHERE email = $1", [
      email,
    ]);
    if (resp.rowCount != 0)
      return res.status(409).json({ message: "data sudah ada" });
    await pool.query(
      "INSERT INTO perusahaan (email,password,nama_perusahaan) VALUES ($1,$2,$3)",
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
    const result = await pool.query(
      "SELECT * FROM perusahaan WHERE email = $1",
      [email]
    );
    if (result.rowCount === 0)
      return res.status(401).json({ message: "email tidak ditemukan" });

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "password salah" });

    const token = jwt.sign(
      { id: user.id_perusahaan, email: user.email },
      process.env.JWT_TOKEN
    );
    res.json({ token: token });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
