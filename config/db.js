import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,       // railway
  process.env.DB_USER,       // root
  process.env.DB_PASSWORD,   // lazuQGSyzyXiLmziQKezLSEYQpAmIjcG
  {
    host: process.env.DB_HOST,        // switchback.proxy.rlwy.net
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306, // 25855
    dialect: "mysql",
    logging: false,   // matikan log SQL
    dialectOptions: {
      connectTimeout: 10000 // 10 detik timeout
    },
  }
);

export default sequelize;
