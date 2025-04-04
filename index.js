const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgres://user:pass@localhost:5432/tba_referrals"
});

// Upsert referral
app.post("/new-referral", async (req, res) => {
  const { phone_number, ...rest } = req.body;

  if (!phone_number) {
    return res.status(400).json({ error: "phone_number is required" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const fields = Object.keys(rest);
    const values = Object.values(rest);

    const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(", ");

    const result = await client.query(
      `
      INSERT INTO referrals (phone_number, ${fields.join(", ")})
      VALUES ($1, ${fields.map((_, i) => `$${i + 2}`).join(", ")})
      ON CONFLICT (phone_number)
      DO UPDATE SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      RETURNING phone_number;
      `,
      [phone_number, ...values]
    );

    await client.query("COMMIT");
    res.json({ success: true, phone_number: result.rows[0].phone_number });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Database error" });
  } finally {
    client.release();
  }
});

app.listen(3000, () => {
  console.log("API listening on port 3000");
});
