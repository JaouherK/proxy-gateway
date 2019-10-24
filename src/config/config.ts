const defaultConfig = {

    // general config
    port: 3232,
    jsonLimit: '20mb',
    isDevelopment: process.env.IS_DEVELOPMENT === 'true',

    // for Sequelize to connect to db
    dialect: getParamByDefault(process.env.DB_TYPE, "mysql"),
    host: getParamByDefault(process.env.DB_HOST, "localhost"),
    database: getParamByDefault(process.env.DB_NAME, "gateway"),
    username: getParamByDefault(process.env.DB_USER, "root"),
    password: getParamByDefault(process.env.DB_PASSWORD, ""),

    //jwt secret
    jwtSecret: "ch@ng3Me"

};

function getParamByDefault(param: any, defaultParam: any): any {
    return (typeof param !== 'undefined') ? param : defaultParam;
}

export const config = defaultConfig;