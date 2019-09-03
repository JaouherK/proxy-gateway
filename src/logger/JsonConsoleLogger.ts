import {LoggerInterface} from "./LoggerInterface";

const chalk = require('chalk');

class JsonConsoleLogger implements LoggerInterface {


    log(data: any): void {
        const success = chalk.bold.green;
        console.log(success(JSON.stringify(data)));
    }

    logError(data: any): void {
        const error = chalk.keyword('orange');
        console.log(error(JSON.stringify(data, [
            "message", "arguments", "type", "name", "stack", "destination", "body", "parent", "process", "tag"
        ])));
    }

    logSecurity(data: any): void {
        // can implement here security measures like send email or...
        // currently it acts as logger only
        const security = chalk.bold.red;
        console.log(security(JSON.stringify(data, [
            "message", "arguments", "type", "name", "stack", "destination", "body", "process", "tag"
        ])));
    }
}

export {JsonConsoleLogger};

