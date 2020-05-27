import {config} from "./config";

export const corsConfig = {
    origin: config.allowedDomains,
    allowedHeaders: config.allowedHeaders,
    credentials: config.credentials,
    methods: config.methods,
    preflightContinue: config.preflightContinue,
    exposedHeaders: ["Development", "Content-Type"]
};
