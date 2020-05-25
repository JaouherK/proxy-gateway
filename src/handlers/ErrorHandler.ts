import {JsonConsoleLogger} from "../logger/JsonConsoleLogger";

export class ErrorHandler {

    /**
     * Manage unhandled:
     *  - rejection => log
     *  - exception => log + force reload by process exit
     */
    public static listenUncaughtErrors(logger: JsonConsoleLogger) {

        process
            .on('unhandledRejection', (reason, p) => {
                logger.logError({message: "Unhandled rejection caught", "tag": "system"});
            })
            .on('uncaughtException', err => {
                logger.logError(err);
                setTimeout(function () {
                    logger.logSecurity({message: '♥ FAIL SAFE SHUTDOWN. Ctrl-C to Force kill', "tag": "system"});
                    process.exit(1);
                }, 5000);
            });
    }
}
