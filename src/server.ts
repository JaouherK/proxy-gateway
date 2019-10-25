import express from 'express';
import {config} from "./config/config";
import {ParsersGroup} from "./middlewares/ParsersGroup";
import {ProxyDomain} from "./domains/ProxyDomain";
import {ManagerRouter} from "./routers/ManagerRouter";
import {ProxyRouter} from "./routers/ProxyRouter";
import {CronJob} from "./cronjob";
import {JsonConsoleLogger} from "./logger/JsonConsoleLogger";
import {ErrorHandler} from "./handlers/ErrorHandler";
import {GlobalSecurityGroup} from "./middlewares/GlobalSecurityGroup";
import {AuthenticationRouter} from "./routers/AuthenticationRouter";
import {ProxyHandler} from "./handlers/ProxyHandler";

const cors = require('cors');
const cluster = require('cluster');

// worker array that keeps relative PIDs
let workers: any = [];

const app = express();
const logger = new JsonConsoleLogger();


app.use(cors());
app.options('*', cors());

// todo: to read number of cores on system
// let numCores = require('os').cpus().length;

app.use(GlobalSecurityGroup);
app.use(ParsersGroup);

// Health Check endpoint
app.get('/_healthCheck', function (req, res) {
    res.sendStatus(200);
    logger.log({process: 'Health check performed', tag: 'cluster'});
});

// Administration
app.use('/manager', ManagerRouter);
app.use('/account', AuthenticationRouter);

// advanced APIs proxy
ProxyHandler.getAllProxyMappings(logger).then((proxies: ProxyDomain[]) => {
        proxies.forEach((proxy: ProxyDomain) => {
            app.use(proxy.url, ProxyRouter.getRouter(proxy, logger));
            logger.log({process: 'Route ' + proxy.url + ' deployed', tag: 'cluster'});
        });
        app.use(function (req, res, next) {
            logger.logError({process: '404 - Route ' + req.url + ' Not found.', tag: '404'});
            return res.status(404).send({error: '404 - Route ' + req.url + ' Not found.'});
        });
    }
).catch(err => logger.logError(err));

// 500 - Any server error
app.use(function (err: any, req: any, res: any, next: any) {
    logger.logError({process: '505 - Route ' + req.url + ' caused Server error.', tag: '500'});
    return res.status(500).send({error: err});
});

if (cluster.isMaster) {

    //could be used later to create parameterizable number of clusters
    workers.push(cluster.fork());

    // to receive messages from worker process
    workers[0].on('message', function (message: string) {
        logger.log({process: message, tag: 'cluster'});
    });

    // process is clustered on a core and process id is assigned
    cluster.on('online', function (worker: any) {
        logger.log({process: 'Worker PID-' + worker.process.pid + ' is listening', tag: 'cluster'});
    });

    // if any of the worker process dies then start a new one by simply forking another one
    cluster.on('exit', function (worker: any, code: string) {
        logger.logError({process: 'Worker ' + worker.process.pid + ' died with code: ' + code, tag: 'cluster'});
        logger.log({process: 'Starting a new worker', tag: 'cluster'});
        cluster.fork();
        workers.push(cluster.fork());
        // to receive messages from worker process
        workers[workers.length - 1].on('message', function (message: string) {
            logger.log({process: message, tag: 'cluster'});
        });
    });

    cluster.on('listening', (worker: any, address: any) => {
        logger.log({
            process: 'Worker PID-' + worker.process.pid + ' is now connected to port: ' + address.port,
            tag: 'cluster'
        });
    });
} else {
    app.listen(config.port);
}

new ErrorHandler().listenUncaughtErrors();
new CronJob().start();
