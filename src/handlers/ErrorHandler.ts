import {JsonConsoleLogger} from "../logger/JsonConsoleLogger";

export class ErrorHandler {

    /**
     * Manage unhandled:
     *  - rejection => log
     *  - exception => log + force reload by process exit
     */
    public listenUncaughtErrors() {
        const logger = new JsonConsoleLogger();

        process
            .on('unhandledRejection', (reason, p) => {
                logger.logError({reason, "tag": "500"});
            })
            .on('uncaughtException', err => {
                logger.logError(err);
                setTimeout(function () {
                    logger.logSecurity({message: '♥ FAIL SAFE SHUTDOWN. Ctrl-C to Force kill', "tag": "500"});
                    process.exit(1);
                }, 5000);
            });
    }
}
