import {Configurations} from "../models/Configurations";
import {sequelize} from "../sequelize";


const defaultConfig = () => {
    getConfig().then((cc) => {
        console.log(cc?.toJSON());
    });
    // const c = getConfig().then(cc => {
    //     console.log(cc);
    //     return cc
    // });
    // console.log(c, null, 2);
    return {
        // general config
        jsonLimit: '20mb',
        // port: ,
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

        // jwt secret
        jwtSecret: getParamByDefault(process.env.JWT_SECRET, "ch@ng3Me"),

        // demo mode params
        demoMode: getParamByDefault(process.env.DEMO_MODE, true),

        // parameters for logger
        timestamp: getParamByDefault(process.env.TIMESTAMP_AVAILABLE, false),
        colorsOutput: getParamByDefault(process.env.COLOR_LOGS, true),

        // express-slow-down configurations
        activeSlowDown: getParamByDefault(process.env.ACTIVE_SLOW_DOWN, true),
        windowMs: getParamByDefault(process.env.SLOW_WINDOW_MS, 60 * 1000),
        delayAfter: getParamByDefault(process.env.SLOW_DELAY_AFTER, 1000),
        delayMs: getParamByDefault(process.env.SLOW_EFFECT_MS, 200),
        maxDelayMs: getParamByDefault(process.env.SLOW_EFFECT_MS, 5 * 1000),

        // Helmet configuration
        enableHelmet: getParamByDefault(process.env.ENABLE_HELMET, true),
    };
};

function getParamByDefault(param: any, defaultParam: any): any {
    return (typeof param !== 'undefined') ? param : defaultParam;
}

function getConfig() {
    sequelize.addModels([Configurations]);
    return Configurations.findOne();
}

export const config = defaultConfig();
