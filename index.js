const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("✅ TBA API is working!");
});

app.post("/new-referral", (req, res) => {
  const data = req.body;

  if (!data.phone_number) {
    return res.status(400).json({ error: "phone_number is required" });
  }

  const phone_number = data.phone_number;

  // Check if referral already exists
  db.query("SELECT * FROM referrals WHERE phone_number = ?", [phone_number], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (results.length > 0) {
      // UPDATE existing record with only the keys provided
      const fields = Object.keys(data).filter(key => key !== "phone_number");
      const values = fields.map(field => data[field]);

      if (fields.length === 0) {
        return res.status(400).json({ error: "No fields to update" });
      }

      const setClause = fields.map(field => `${field} = ?`).join(", ");
      const sql = `UPDATE referrals SET ${setClause} WHERE phone_number = ?`;
      db.query(sql, [...values, phone_number], (e) => {
        if (e) return res.status(500).json({ error: "Update failed" });
        return res.json({ success: true, action: "updated", phone_number });
      });

    } else {
      // INSERT a new record
      const fields = Object.keys(data);
      const values = Object.values(data);
      const placeholders = fields.map(() => "?").join(", ");

      const sql = `INSERT INTO referrals (${fields.join(", ")}) VALUES (${placeholders})`;
      db.query(sql, values, (e) => {
        if (e) return res.status(500).json({ error: "Insert failed", details: e.message });
        return res.json({ success: true, action: "created", phone_number });
      });
    }
  });
});


// ✅ Let Passenger handle the port
app.listen(process.env.PORT || 3000, () => {
  console.log("✅ TBA API is running.");
});
