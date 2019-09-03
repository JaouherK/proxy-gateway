import {JsonConsoleLogger} from "./logger/JsonConsoleLogger";

export class CronJob {
    public start() {
        const logger = new JsonConsoleLogger();
        const cronJob = require('cron').CronJob;
        const restart = new cronJob({
            cronTime: '00 30 00 * * *',
            onTick() {
                const d = new Date();
                logger.logSecurity({
                    process: d + " - Scheduled service restart ♥ FAILSAFE SHUTDOWN.",
                    tag: 'cluster'
                });
                process.kill(process.pid);
            },
            start: false,
            timeZone: 'CET'
        });
        restart.start();
    }
}
