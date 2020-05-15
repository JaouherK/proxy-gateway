import {Sequelize} from "sequelize-typescript";
import {dbConfig} from "./config/dbConfig";

export const sequelize = new Sequelize({
    dialect: dbConfig.dialect,
    host: dbConfig.host,
    database: dbConfig.database,
    username: dbConfig.username,
    password: dbConfig.password,
    modelPaths: [__dirname + '/models'],
    // set logging to true if you want sal logging
    logging: false
});
