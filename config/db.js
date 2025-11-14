import "mysql2"; // ✅ penting buat driver MySQL
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,        // railway
  process.env.DB_USER,        // root
  process.env.DB_PASSWORD,    // password dari Railway
  {
    host: process.env.DB_HOST, // switchback.proxy.rlwy.net
    port: process.env.DB_PORT, // 25855
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // ⛔ penting untuk proxy SSL Railway
      },
      connectTimeout: 60000, // ⏱️ biar gak timeout
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// 🧩 Tes koneksi pas app start
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to Railway MySQL Database!");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  }
})();

export default sequelize;
