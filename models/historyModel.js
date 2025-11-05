import { Sequelize, UUID } from "sequelize";
import db from "../config/db.js";

const {DataTypes} = Sequelize;

const History = db.define("history",{
    uuid:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },

    order_id:{
        type: DataTypes.UUID,
        allowNull: false,
    },

    user_id:{
        type: DataTypes.UUID,
        allowNull: false,
    },

    mechanic_id:{
        type: DataTypes.UUID,
        allowNull: false,
    },

    service_type:{
        type: DataTypes.STRING,
        allowNull: false,
    },

    total_cost:{
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
    },

    commission:{
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
    },

    payment_method:{
        type: DataTypes.STRING,
        allowNull: false,
    },

    status:{
        type: DataTypes.ENUM("selesai","dibatalkan","refund"),
        defaultValue: "selesai",
        allowNull: false,
    },

    notes:{
        type: DataTypes.TEXT,
        allowNull: false,
    },

    date_completed:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
},{
    freezeTableName:true,
    timestamps: false
});

export default History;