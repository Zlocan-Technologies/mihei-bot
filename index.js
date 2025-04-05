const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("✅ TBA API is working!");
});

app.post("/new-referral", (req, res) => {
  const { phone_number, first_name } = req.body;
  if (!phone_number) return res.status(400).json({ error: "phone_number is required" });

  const query = "SELECT * FROM referrals WHERE phone_number = ?";
  db.query(query, [phone_number], (err, results) => {
    if (err) return res.status(500).json({ error: "Query failed" });

    if (results.length > 0) {
      const update = "UPDATE referrals SET first_name = ? WHERE phone_number = ?";
      db.query(update, [first_name, phone_number], (e) =>
        e ? res.status(500).json({ error: "Update failed" }) : res.json({ success: true, phone_number })
      );
    } else {
      const insert = "INSERT INTO referrals (phone_number, first_name) VALUES (?, ?)";
      db.query(insert, [phone_number, first_name], (e) =>
        e ? res.status(500).json({ error: "Insert failed" }) : res.json({ success: true, phone_number })
      );
    }
  });
});

// ✅ Let Passenger handle the port
app.listen(process.env.PORT || 3000, () => {
  console.log("✅ TBA API is running.");
});
