import {Request, Response} from 'express';
import {JsonConsoleLogger} from "../logger/JsonConsoleLogger";
import cors from 'cors';
import {corsConfig} from "../config/corsConfig";
import helmet = require("helmet");


const logger = new JsonConsoleLogger();

/******************* Slow down Logic ****************************/
/* more details https://www.npmjs.com/package/express-slow-down */
const slowDown = require('express-slow-down');
const onLimitReached = (req: Request, res: Response, options: any) => {
    logger.log({message: 'Quota requests/minute reached. Process slowed down: ' + req.ip, tag: 'slow-down'});
};

const speedLimiter = slowDown({
    windowMs: 60 * 1000, // 1 minutes
    delayAfter: 600, // allow 600 requests per 1 minute, then...
    delayMs: 500, // begin adding 500ms of delay per request above 600:
    onLimitReached
});

/************* Helmet config **********************/
/* more details: https://helmetjs.github.io/docs/ */
const GlobalSecurityGroup = [
    // Initialize helmet includes X-XSS-Protection, X-DNS-Prefetch-Control,
    // Strict-Transport-Security, X-Content-Type-Options headers
    helmet(),

    // set header X-Frame-Options to deny against clickjacking
    helmet.frameguard({action: 'deny'}),

    // set header X-Permitted-Cross-Domain-Policies: none
    // helmet.permittedCrossDomainPolicies(),

    // Lie and fake the powered by header to display php 5.6
    helmet.hidePoweredBy({setTo: 'PHP 5.6.0'}),

    // set header Referrer-Policy: no-referrer
    helmet.referrerPolicy(),

    // set header Content-Security-Policy: script-src 'self'
    helmet.contentSecurityPolicy({
        directives: {
            scriptSrc: ["'self'"]
        }
    }),

    cors(corsConfig),

    /* Slow down middleware after window of time */
    speedLimiter,
];

export {GlobalSecurityGroup};
