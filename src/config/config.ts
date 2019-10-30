const defaultConfig = {

    jsonLimit: '20mb',
    // general config
    port: getParamByDefault(process.env.PORT, "3232"),
    isDevelopment: process.env.IS_DEVELOPMENT === 'true',

    // for Sequelize to connect to db
    dialect: getParamByDefault(process.env.DB_TYPE, "mysql"),
    host: getParamByDefault(process.env.DB_HOST, "localhost"),
    database: getParamByDefault(process.env.DB_NAME, "gateway"),
    username: getParamByDefault(process.env.DB_USER, "root"),
    password: getParamByDefault(process.env.DB_PASS, ""),

    //jwt secret
    jwtSecret: getParamByDefault(process.env.JWT_SECRET, "ch@ng3Me"),

    // demo mode params
    demoMode: getParamByDefault(process.env.DEMO_MODE, true),
};

function getParamByDefault(param: any, defaultParam: any): any {
    return (typeof param !== 'undefined') ? param : defaultParam;
}

export const config = defaultConfig;