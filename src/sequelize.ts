import {config} from "./config/config";
import {Sequelize} from "sequelize-typescript";

const confDialect = config.dialect;
const confHost = config.host;
const confDatabase = config.database;
const confUsername = config.username;
const confPassword = config.password;

export const sequelize = new Sequelize({
    dialect: confDialect,
    host: confHost,
    database: confDatabase,
    username: confUsername,
    password: confPassword,
    modelPaths: [__dirname + '/models'],
    logging: false
});
