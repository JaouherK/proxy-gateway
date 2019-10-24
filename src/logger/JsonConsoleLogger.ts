const chalk = require('chalk');

class JsonConsoleLogger  {

    /**
     * Log normal message
     * @param  {any} data
     * @return {void}
     */
    log(data: any): void {
        const t:any = {};
        t.timestamp = new Date().getTime();
        let v = Object.assign(t, data);
        const success = chalk.bold.green;
        console.log(success(JSON.stringify(v)));
    }

    /**
     * Log error message
     * @param  {any} data
     * @return {void}
     */
    logError(data: any): void {
        const timestamp = new Date().getTime();
        data.timestamp = timestamp;
        const error = chalk.keyword('orange');
        console.log(error(JSON.stringify(data, [
            "timestamp", "message", "arguments", "type", "name", "stack", "destination", "body", "process", "tag"
        ])));
    }

    /**
     * Log security/critical message
     * could use a notification middleware
     * @param  {any} data
     * @return {void}
     */
    logSecurity(data: any): void {
        const timestamp = new Date().getTime();
        data.timestamp = timestamp;
        // can implement here security measures like send email or...
        // currently it acts as logger only
        const security = chalk.bold.red;
        console.log(security(JSON.stringify(data, [
            "timestamp", "message", "arguments", "type", "name", "stack", "destination", "body", "process", "tag"
        ])));
    }
}

export {JsonConsoleLogger};

