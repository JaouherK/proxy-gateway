const defaultConfig = {
    port: 3232,
    jsonLimit: '20mb',
    isDevelopment: process.env.IS_DEVELOPMENT === 'true',

    // for Sequelize to connect to db
    dialect: getParamByDefault(process.env.DB_TYPE, "mysql"),
    host: getParamByDefault(process.env.DB_HOST, "localhost"),
    database: getParamByDefault(process.env.DB_NAME, "gateway"),
    username: getParamByDefault(process.env.DB_USER, "root"),
    password: getParamByDefault(process.env.DB_PASSWORD, ""),

    //github credentials
    githubClientID: getParamByDefault(process.env.GIT_CLIENT_ID, "378f9143a4dd707c4257"),
    githubClientSecret: getParamByDefault(process.env.GIT_CLIENT_SECRET, "55effb11ada89d7daeb727ce8e8a482889600eef"),
    githubCallbackURL: getParamByDefault(process.env.GIT_CLIENT_CALLBACK, ""),
};

function getParamByDefault(param: any, defaultParam: any): any {
    return (typeof param !== 'undefined') ? param : defaultParam;
}

export const config = defaultConfig;