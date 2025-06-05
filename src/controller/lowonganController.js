import { pool } from "../db/db.js";

export async function getData(req, res) {
  try {
    const resp = await pool.query(
      "SELECT id_lowongan, posisi, gaji_min, gaji_max, kategori, jenis, tingkatan, lowongan.tentang AS tentang_lowongan, syarat, skill, lowongan.created_at AS lowongan_created_at, perusahaan.id_perusahaan AS perusahaan_id, email, nama_perusahaan, picture, situs, tahun_didirikan, bidang, karyawan,perusahaan.tentang AS tentang_perusahaan, lokasi, provinsi, visi, misi, role,perusahaan.created_at AS perusahaan_created_at FROM lowongan JOIN perusahaan ON lowongan.id_perusahaan = perusahaan.id_perusahaan"
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
      "SELECT id_lowongan, posisi, gaji_min, gaji_max, kategori, jenis, tingkatan, lowongan.tentang AS tentang_lowongan, syarat, skill, lowongan.created_at AS lowongan_created_at, perusahaan.id_perusahaan AS perusahaan_id, email, nama_perusahaan, picture, situs, tahun_didirikan, bidang, karyawan,perusahaan.tentang AS tentang_perusahaan, lokasi, provinsi, visi, misi, role,perusahaan.created_at AS perusahaan_created_at FROM lowongan JOIN perusahaan ON lowongan.id_perusahaan = perusahaan.id_perusahaan WHERE id_lowongan = $1",
      [id]
    );
    res.json(resp.rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function handleInsert(req, res) {
  const {
    posisi,
    gajiMin,
    gajiMax,
    kategori,
    jenis,
    tingkatan,
    tentang,
    syarat,
    skill,
    perusahaan,
  } = req.body;

  try {
    await pool.query(
      "INSERT INTO lowongan (posisi,gaji_min,gaji_max,kategori,jenis,tingkatan,tentang,syarat,skill,id_perusahaan) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",
      [
        posisi,
        gajiMin,
        gajiMax,
        kategori,
        jenis,
        tingkatan,
        tentang,
        syarat,
        skill,
        perusahaan,
      ]
    );
    res.json({ message: "Data ditambahkan" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function handleUpdate(req, res) {
  const { id } = req.params;
  const {
    posisi,
    gajiMin,
    gajiMax,
    kategori,
    jenis,
    tingkatan,
    tentang,
    syarat,
    skill,
  } = req.body;

  try {
    await pool.query(
      "UPDATE lowongan SET posisi = $1,gaji_min = $2,gaji_max = $3, kategori = $4, jenis = $5, tingkatan = $6, tentang = $7, syarat = $8, skill = $9 WHERE id_lowongan = $10",
      [
        posisi,
        gajiMin,
        gajiMax,
        kategori,
        jenis,
        tingkatan,
        tentang,
        syarat,
        skill,
        id,
      ]
    );
    res.json({ message: "Data diubah" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function handleDelete(req, res) {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM lowongan WHERE id_lowongan = $1", [id]);
    res.json({ message: "Data dihapus" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
