const defaultConfig = {
    port: 3232,
    jsonLimit: '20mb',

    // for sequelize to connect to db
    dialect:"mysql",
    host: "localhost",
    database: "gateway",
    username: "root",
    password: "",
};

export const config = defaultConfig;