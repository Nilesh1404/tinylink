// pages/api/links/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../lib/db";
import { isValidCode, isValidHttpUrl } from "../../../lib/validators";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // ------------------------------------
  // GET /api/links → Return all links
  // ------------------------------------
  if (req.method === "GET") {
    const { rows } = await pool.query(
      "SELECT code, url, clicks, last_clicked, created_at FROM links ORDER BY created_at DESC"
    );
    return res.status(200).json(rows);
  }

  // ------------------------------------
  // POST /api/links → Create a new link
  // ------------------------------------
  if (req.method === "POST") {
    const { url, code } = req.body;

    // Validate URL
    if (!url || !isValidHttpUrl(url)) {
      return res.status(400).json({ error: "Invalid URL" });
    }

    // If custom code is provided
    if (code) {
      if (!isValidCode(code)) {
        return res
          .status(400)
          .json({ error: "Invalid code format (A-Za-z0-9, 6-8 chars)" });
      }

      try {
        await pool.query("INSERT INTO links (code, url) VALUES ($1, $2)", [
          code,
          url,
        ]);
        return res.status(201).json({ code, url });
      } catch (err: any) {
        if (err.code === "23505") {
          return res.status(409).json({ error: "Code already exists" });
        }
        return res.status(500).json({ error: "Database error" });
      }
    }

    // Auto-generate random code
    const generateCode = () => Math.random().toString(36).slice(2, 8); // 6 chars

    for (let i = 0; i < 5; i++) {
      const generated = generateCode();
      try {
        await pool.query("INSERT INTO links (code, url) VALUES ($1, $2)", [
          generated,
          url,
        ]);
        return res.status(201).json({ code: generated, url });
      } catch (err: any) {
        if (err.code === "23505") continue; // duplicate → try again
      }
    }

    return res.status(500).json({ error: "Failed to generate unique code" });
  }

  // ------------------------------------
  // Unsupported method
  // ------------------------------------
  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: "Method Not Allowed" });
}
