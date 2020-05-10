const defaultConfig = {

    // general config
    jsonLimit: '20mb',
    port: getParamByDefault(process.env.PORT, "3232"),
    isDevelopment: process.env.IS_DEVELOPMENT === 'true',

    // CORS config
    allowedDomains: getParamByDefault(process.env.ALLOWED_DOMAINS, '*'),
    allowedHeaders: getParamByDefault(
        process.env.ALLOWED_HEADERS,
        ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"]
    ),
    credentials: getParamByDefault(process.env.CORS_CREDENTIALS, true),
    methods: getParamByDefault(process.env.ALLOWED_MOTHODS, "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE"),
    preflightContinue: getParamByDefault(process.env.PREFLIGHT_CONTINUE, false),

    // for Sequelize to connect to db
    dialect: getParamByDefault(process.env.DB_TYPE, "mysql"),
    host: getParamByDefault(process.env.DB_HOST, "localhost"),
    database: getParamByDefault(process.env.DB_NAME, "gateway"),
    username: getParamByDefault(process.env.DB_USER, "root"),
    password: getParamByDefault(process.env.DB_PASS, ""),

    // jwt secret
    jwtSecret: getParamByDefault(process.env.JWT_SECRET, "ch@ng3Me"),

    // demo mode params
    demoMode: getParamByDefault(process.env.DEMO_MODE, true),

    // parameters for logger
    timestamp: getParamByDefault(process.env.TIMESTAMP_AVAILABLE, false),
    colorsOutput: getParamByDefault(process.env.COLOR_LOGS, true)
};

function getParamByDefault(param: any, defaultParam: any): any {
    return (typeof param !== 'undefined') ? param : defaultParam;
}

export const config = defaultConfig;
