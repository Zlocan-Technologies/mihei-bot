// const mysql = require("mysql2");

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "zlocanco_tba_referral",
//   password: "FZZPsYVGHgvSSvU76GGn",
//   database: "zlocanco_tba_referral"
// });

// db.connect((err) => {
//   if (err) {
//     console.error("❌ MySQL connection error:", err.message);
//   } else {
//     console.log("✅ Connected to MySQL database.");
//   }
// });

// module.exports = db;


const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://tba_referrals_user:2ZueFtERb21gMLMb2whuJWCadfa5hsyh@dpg-cvoemommcj7s73836ac0-a.oregon-postgres.render.com/tba_referrals",
  ssl: {
    rejectUnauthorized: false // Render requires SSL, but self-signed
  }
});

pool.connect((err) => {
  if (err) {
    console.error("❌ PostgreSQL connection failed:", err.message);
  } else {
    console.log("✅ Connected to PostgreSQL database on Render.");
  }
});

module.exports = pool;
