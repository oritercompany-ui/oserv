const Order = db.define(
  "Order",
  {
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: { type: DataTypes.UUID, allowNull: false },
    vehicle_type: DataTypes.STRING,
    vehicle_brand: DataTypes.STRING,
    vehicle_model: DataTypes.STRING,
    license_plate: DataTypes.STRING,
    color: DataTypes.STRING,
    service_type: DataTypes.STRING,
    problem_description: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM("pending", "on_progress", "finished", "cancelled"),
      defaultValue: "pending",
    },
    address: DataTypes.STRING,
  },
  {
    freezeTableName: true, // ✅ pakai nama tabel persis: Order
  }
);

export default Order;
