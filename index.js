const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("✅ Connected to PostgreSQL API!");
});

app.post("/new-referral", async (req, res) => {
  const data = req.body;

  if (!data.phone_number) {
    return res.status(400).json({ error: "phone_number is required" });
  }

  const phone_number = data.phone_number;

  try {
    const check = await db.query("SELECT * FROM referrals WHERE phone_number = $1", [phone_number]);

    if (check.rows.length > 0) {
      // Update
      const fields = Object.keys(data).filter(key => key !== "phone_number");
      const values = fields.map(field => data[field]);
      if (fields.length === 0) {
        return res.status(400).json({ error: "No fields to update" });
      }

      const setClause = fields.map((field, idx) => `${field} = $${idx + 1}`).join(", ");
      const sql = `UPDATE referrals SET ${setClause} WHERE phone_number = $${fields.length + 1}`;
      await db.query(sql, [...values, phone_number]);

      return res.json({ success: true, action: "updated", phone_number });
    } else {
      // Insert
      const fields = Object.keys(data);
      const values = Object.values(data);
      const placeholders = fields.map((_, idx) => `$${idx + 1}`).join(", ");

      const sql = `INSERT INTO referrals (${fields.join(", ")}) VALUES (${placeholders})`;
      await db.query(sql, values);

      return res.json({ success: true, action: "created", phone_number });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("✅ API running and connected to PostgreSQL");
});
