import express from 'express';
import {ParsersGroup} from "./middlewares/ParsersGroup";
import {CronJob} from "./Cronjob";
import {JsonConsoleLogger} from "./logger/JsonConsoleLogger";
import {ErrorHandler} from "./handlers/ErrorHandler";
import {GlobalSecurityGroup} from "./middlewares/GlobalSecurityGroup";
import {MainRouter} from "./routers/MainRouter";
import {ClusterConfiguration} from "./ClusterConfiguration";
import {GlobalErrorsMiddleware} from "./middlewares/GlobalErrorsMiddleware";

const app = express();
const logger = new JsonConsoleLogger();

app.use(GlobalSecurityGroup);
app.use(ParsersGroup);

MainRouter.init(app, logger);

app.use(GlobalErrorsMiddleware.toCallable(logger));

ClusterConfiguration.init(app, logger);

ErrorHandler.listenUncaughtErrors(logger);

CronJob.start(logger);
