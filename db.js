const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "zlocanco_tba_referral",
  password: "FZZPsYVGHgvSSvU76GGn",
  database: "zlocanco_tba_referral"
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection error:", err.message);
  } else {
    console.log("✅ Connected to MySQL database.");
  }
});

module.exports = db;
