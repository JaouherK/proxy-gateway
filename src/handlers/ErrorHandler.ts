import {JsonConsoleLogger} from "../logger/JsonConsoleLogger";

export class ErrorHandler {
    public listenUncatchErrors() {
        const logger = new JsonConsoleLogger();

        process
            .on('unhandledRejection', (reason, p) => {
                logger.logError({reason, "tag": "500"});
            })
            .on('uncaughtException', err => {
                logger.logError(err);
                setTimeout(function () {
                    logger.logSecurity({message: '♥ FAILSAFE SHUTDOWN. Ctrl-C to Force kill', "tag": "500"});
                    process.exit(1);
                }, 5000);
            });
    }
}