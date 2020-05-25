import {config} from "./config";

export const corsConfig = {
    origin: (origin: string, callback: any) => {
        if (config.allowedDomains === '*' || !origin) {
            callback(null, true);
            return;
        }
        for (const domain of config.allowedDomains.split(',')) {
            if (origin.indexOf(domain.trim()) !== -1) {
                callback(null, true);
                return;
            }
        }
        callback(null, false);
        return;
    },
    allowedHeaders: config.allowedHeaders,
    credentials: config.credentials,
    methods: config.methods,
    preflightContinue: config.preflightContinue,
    exposedHeaders: ["Development", "Content-Type"]
};
