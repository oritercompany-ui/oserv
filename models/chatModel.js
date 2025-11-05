import { DataTypes } from "sequelize";
import db from "../config/db.js";
import Order from "./Order.js";

const Chat = db.define("Chat", {
  order_id: { type: DataTypes.INTEGER, allowNull: false },
  sender: { type: DataTypes.ENUM("user","mechanic"), allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
});

Chat.belongsTo(Order, { foreignKey: "order_id" });
Order.hasMany(Chat, { foreignKey: "order_id" });

export default Chat;
