
export class CronJob {
    public start() {
        const cronJob = require('cron').CronJob;
        const restart = new cronJob({
            cronTime: '00 30 00 * * *',
            onTick() {
                const d = new Date();
                console.log({message: d + " - Scheduled service restart ♥ FAILSAFE SHUTDOWN."});
                process.exit(1);
            },
            start: false,
            timeZone: 'CET'
        });
        restart.start();
    }
}
