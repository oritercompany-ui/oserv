// models/authModel.js
import { DataTypes } from "sequelize";
import db from "../config/db.js";
import Role from "./roleModel.js";

// Tabel auths (user)
const Auth = db.define(
  "auths",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true, // ✅ UUID sebagai primary key
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1, // Default = user
      references: {
        model: "roles",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
  },
  {
    freezeTableName: true,
    timestamps: true, // createdAt, updatedAt otomatis
  }
);

// 🔗 Relasi dengan tabel roles
Auth.belongsTo(Role, { foreignKey: "role_id", as: "role" });
Role.hasMany(Auth, { foreignKey: "role_id", as: "auths" });

export default Auth;
