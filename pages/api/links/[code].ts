// pages/api/links/[code].ts
import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const code = req.query.code as string;

  // ------------------------------------
  // GET /api/links/:code  → return stats for one link
  // ------------------------------------
  if (req.method === "GET") {
    const { rows } = await pool.query(
      "SELECT code, url, clicks, last_clicked, created_at FROM links WHERE code = $1",
      [code]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Not found" });
    }

    return res.status(200).json(rows[0]);
  }

  // ------------------------------------
  // DELETE /api/links/:code  → delete link
  // ------------------------------------
  if (req.method === "DELETE") {
    const result = await pool.query("DELETE FROM links WHERE code = $1", [
      code,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Not found" });
    }

    return res.status(204).end();
  }

  // ------------------------------------
  // Unsupported method
  // ------------------------------------
  res.setHeader("Allow", ["GET", "DELETE"]);
  return res.status(405).json({ error: "Method Not Allowed" });
}
