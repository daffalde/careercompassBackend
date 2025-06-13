import { pool } from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { storage } from "../db/appwrite.js";
import { InputFile } from "node-appwrite/file";

export async function getAllData(req, res) {
  try {
    const query = `
      SELECT id_perusahaan, email, role, nama_perusahaan, picture, situs, 
             tahun_didirikan, bidang, karyawan, lokasi, provinsi, tentang, 
             visi, misi, created_at 
      FROM perusahaan
    `;

    const resp = await pool.query(query);
    res.json({ data: resp.rows });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function getData(req, res) {
  const { cursor, limit, nama_perusahaan, provinsi } = {
    cursor: parseInt(req.query.cursor, 10) || null,
    limit: parseInt(req.query.limit, 10) || 10,
    nama_perusahaan: req.query.nama_perusahaan || null,
    provinsi: req.query.provinsi || null,
  };

  try {
    const values = [];
    const conditions = [];

    let query = `
      SELECT id_perusahaan, email,role, nama_perusahaan, picture, situs, tahun_didirikan, bidang, karyawan, lokasi,provinsi,tentang,visi,misi, created_at FROM perusahaan
    `;

    if (cursor) {
      conditions.push(`id_perusahaan < $${values.length + 1}`);
      values.push(cursor);
    }

    if (nama_perusahaan) {
      conditions.push(`nama_perusahaan ILIKE $${values.length + 1}`);
      values.push(`%${nama_perusahaan}%`);
    }

    if (provinsi) {
      conditions.push(`provinsi ILIKE $${values.length + 1}`);
      values.push(`%${provinsi}%`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(" AND ");
    }

    query += ` ORDER BY id_perusahaan DESC LIMIT $${values.length + 1}`;
    values.push(limit + 1);

    const resp = await pool.query(query, values);
    const results = resp.rows;

    const hasNext = results.length > limit;
    if (hasNext) results.pop();

    const nextCursor = hasNext
      ? results[results.length - 1].id_perusahaan
      : null;

    res.json({
      data: results,
      nextCursor,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function selectData(req, res) {
  const { id } = req.params;
  try {
    const resp = await pool.query(
      "SELECT id_perusahaan, email,role, nama_perusahaan, picture, situs, tahun_didirikan, bidang, karyawan, lokasi,provinsi,tentang,visi,misi, created_at FROM perusahaan WHERE id_perusahaan = $1",
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
      "UPDATE perusahaan SET nama_perusahaan = COALESCE($1, nama_perusahaan), situs = COALESCE($2, situs), tahun_didirikan = COALESCE($3, tahun_didirikan), bidang = COALESCE($4, bidang), karyawan = COALESCE($5, karyawan), lokasi = COALESCE($6, lokasi), provinsi = COALESCE($7, provinsi), tentang = COALESCE($8, tentang), visi = COALESCE($9, visi), misi = COALESCE($10, misi) WHERE id_perusahaan = $11",
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
    const resp = await pool.query(
      "SELECT id_perusahaan,role, nama_perusahaan,picture,email FROM perusahaan WHERE email = $1",
      [email]
    );

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "password salah" });

    const token = jwt.sign(
      { id: user.id_perusahaan, email: user.email },
      process.env.JWT_TOKEN
    );
    res.json({ token: token, data: resp.rows });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
