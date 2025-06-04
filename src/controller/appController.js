import { pool } from "../db/db.js";

export async function getData(req, res) {
  try {
    const resp = await pool.query("SELECT * FROM application");
    res.json(resp.rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function insertData(req, res) {
  const { status, notes, surat, lowongan, pelamar, cv } = req.body;
  try {
    await pool.query(
      "INSERT INTO application (status,notes,surat,id_lowongan,id_pelamar,id_cv) VALUES ($1,$2,$3,$4,$5,$6)",
      [status, notes, surat, lowongan, pelamar, cv]
    );
    res.json({ message: "Data ditambah" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function updateData(req, res) {
  const { id } = req.params;
  const { status, notes } = req.body;
  try {
    await pool.query(
      "UPDATE application SET status = $1, notes = $2 WHERE id_application = $3",
      [status, notes, id]
    );
    res.json({ message: "Data diedit" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function handleDelete(req, res) {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM application WHERE id_application = $1", [id]);
    res.json({ message: "Data dihapus" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
