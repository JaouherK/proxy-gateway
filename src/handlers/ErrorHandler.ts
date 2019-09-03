import {JsonConsoleLogger} from "../logger/JsonConsoleLogger";

export class ErrorHandler {
    public listenUncatchErrors() {
        const logger = new JsonConsoleLogger();

        process
            .on('unhandledRejection', (reason, p) => {
                logger.logError(reason);
            })
            .on('uncaughtException', err => {
                logger.logError(err);
                setTimeout(function () {
                    logger.logSecurity('♥ FAILSAFE SHUTDOWN. Ctrl-C to Force kill');
                    process.exit(1);
                }, 5000);
            });
    }
}
