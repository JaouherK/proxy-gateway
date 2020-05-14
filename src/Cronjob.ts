import {JsonConsoleLogger} from "./logger/JsonConsoleLogger";

const cronjob = require('cron').CronJob;


export class CronJob {
    public static start(logger: JsonConsoleLogger) {
        CronJob.scheduledRestart(logger);
    }

    private static scheduledRestart(logger: JsonConsoleLogger) {
        // cronJob to restart the server every night

        const restart = new cronjob({
            cronTime: '00 30 00 * * *',
            onTick() {
                const d = new Date();
                logger.logSecurity({message: d + " - Scheduled service restart ♥ FAILSAFE SHUTDOWN.", tag: 'cronJob'});
                process.kill(process.pid);
            },
            start: false,
            timeZone: 'CET'
        });
        restart.start();
    }
}
