import {Request, Response} from "express";
import {config} from "../config/config";
import {JsonConsoleLogger} from "../logger/JsonConsoleLogger";


/******************* Slow down Logic ****************************/
/* more details https://www.npmjs.com/package/express-slow-down */

const slowDown = require('express-slow-down');

export class SlowDownMiddleware {
    private logger: JsonConsoleLogger;

    constructor() {
        this.logger = new JsonConsoleLogger();
    }

    toCallable() {
        const onLimitReached = (req: Request, res: Response, options: any) => {
            this.logger.log({message: 'Quota requests/minute reached. Process slowed down: ' + req.ip, tag: 'slow-down'});
        };
        return slowDown({
            skip: () => !config.activeSlowDown,
            windowMs: config.windowMs, // 1 minutes
            delayAfter: config.delayAfter, // allow 1000 requests per 1 minute, then...
            delayMs: config.delayMs, // begin adding 200ms of delay per request above 1000:
            maxDelayMs: config.maxDelayMs,  // delay will not increase past the config value
            onLimitReached
        });
    }
}
