import {JsonConsoleLogger} from "../../src/logger/JsonConsoleLogger";

const chalk = require('chalk');

const mockLoggerData = {
    timestamp: new Date().getTime(),
    header: {},
    context: {}
};

const mockLoggerErrorData = {
    timestamp: new Date().getTime(),
    header: {},
    context: {},
    message: "error"
};

const mockLoggerSecurityData = {
    timestamp: new Date().getTime(),
    message: "error"
};

describe('JsonConsoleLogger', () => {

    const logger = new JsonConsoleLogger();
    let spyOnConsole: any;

    beforeEach(() => {
        spyOnConsole = spyOn(console, 'log');
    });

    it('should execute log function', () => {
        logger.log(mockLoggerData);
        const success = chalk.bold.green;
        expect(spyOnConsole).toHaveBeenCalledWith(success(JSON.stringify(mockLoggerData)));
    });

    it('should execute log error function', () => {
        logger.logError(mockLoggerErrorData);
        const error = chalk.keyword('orange');
        expect(spyOnConsole).toHaveBeenCalledWith(
            error(JSON.stringify(mockLoggerErrorData)));
    });

    it('should execute log Security function', () => {
        logger.logSecurity(mockLoggerSecurityData);
        const security = chalk.bold.red;
        expect(spyOnConsole).toHaveBeenCalledWith(
            security(JSON.stringify(mockLoggerSecurityData))
        );
    });
});
