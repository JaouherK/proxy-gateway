import {LoggerInterface} from "./loggerInterface";

class JsonConsoleLogger implements LoggerInterface {
    // console log color referneces
    private successOutput = "\x1b[32m";
    private warningOutput = "\x1b[33m";
    private dangerOutput = "\x1b[31m";


    log(data: any): void {
        console.log(this.successOutput, JSON.stringify(data));
    }

    logError(data: any): void {
        console.log(this.warningOutput, JSON.stringify(data, [
            "message", "arguments", "type", "name", "stack", "destination", "body", "parent"
        ]));
    }

    logSecurity(data: any): void {
        // can implement here security measures like send email or...
        // currently it acts as logger only
        console.log(this.dangerOutput, JSON.stringify(data, ["message", "arguments", "type", "name", "stack", "destination", "body"]));
    }
}

export {JsonConsoleLogger};

