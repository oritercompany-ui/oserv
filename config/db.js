import { Sequelize } from "sequelize";

const db = new Sequelize ("service_app","root","",{
    host: "localhost",
    dialect: "mysql",
});

export default db;