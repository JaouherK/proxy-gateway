import {config} from "../config/config";

const chalk = require('chalk');

export class JsonConsoleLogger {

    /**
     * Log normal message
     * @param  {any} data
     * @return {void}
     */
    log(data: any): void {
        console.log(JsonConsoleLogger.prepareMessage(data, "success"));
    }

    /**
     * Log error message
     * @param  {any} data
     * @return {void}
     */
    logError(data: any): void {
        console.log(JsonConsoleLogger.prepareMessage(data, "warn"));
    }

    /**
     * Log security/critical message
     * could use a notification middleware
     * @param  {any} data
     * @return {void}
     */
    logSecurity(data: any): void {
        // could add here a notification middleware
        console.log(JsonConsoleLogger.prepareMessage(data, "error"));
    }

    private static prepareMessage(data: any, type: string) {
        const t: any = {};
        if (config.timestamp) {
            t.timestamp = new Date().getTime();
        }
        const v = {...t, ...data};
        if (!config.colorsOutput) {
            return JSON.stringify(v);
        }
        let color;
        switch (type) {
            case "success":
                color = chalk.bold.green;
                break;
            case "warn":
                color = chalk.keyword('orange');
                break;
            case "error":
                color = chalk.bold.red;
                break;
        }

        return color(JSON.stringify(v));
    }

}

