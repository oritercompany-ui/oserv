import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Payment = db.define(
  "Payments",
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    order_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    mechanic_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    method: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    transaction_status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
    },

    paid_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    // COPY DATA ORDER
    order_name: { type: DataTypes.STRING },
    vehicle_type: { type: DataTypes.STRING },
    vehicle_brand: { type: DataTypes.STRING },
    vehicle_model: { type: DataTypes.STRING },
    license_plate: { type: DataTypes.STRING },
    color: { type: DataTypes.STRING },
    order_status: { type: DataTypes.STRING },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

export default Payment;
