import { pool } from "../db/db.js";

export async function getDataLowongan(req, res) {
  try {
    const resp = await pool.query("SELECT * FROM lowongan_tersimpan");
    res.json(resp.rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function handleInsertLowongan(req, res) {
  const { pelamar, lowongan } = req.body;
  try {
    await pool.query(
      "INSERT INTO lowongan_tersimpan (id_pelamar,id_lowongan) VALUES ($1,$2)",
      [pelamar, lowongan]
    );
    res.json({ message: "Data ditambahkan" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function handleDeleteLowongan(req, res) {
  const { id } = req.params;
  try {
    await pool.query(
      "DELETE FROM lowongan_tersimpan WHERE id_lowongan_tersimpan = $1",
      [id]
    );
    res.json({ message: "Data dihapus" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

// _____________________________________________________________________________
export async function getDataPerusahaan(req, res) {
  try {
    const resp = await pool.query("SELECT * FROM perusahaan_tersimpan");
    res.json(resp.rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function handleInsertPerusahaan(req, res) {
  const { pelamar, lowongan } = req.body;
  try {
    await pool.query(
      "INSERT INTO perusahaan_tersimpan (id_pelamar,id_perusahaan) VALUES ($1,$2)",
      [pelamar, lowongan]
    );
    res.json({ message: "Data ditambahkan" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function handleDeletePerusahaan(req, res) {
  const { id } = req.params;
  try {
    await pool.query(
      "DELETE FROM perusahaan_tersimpan WHERE id_perusahaan_tersimpan = $1",
      [id]
    );
    res.json({ message: "Data dihapus" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
