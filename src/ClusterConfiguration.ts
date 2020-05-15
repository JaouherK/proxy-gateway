import {config} from "./config/config";
import {JsonConsoleLogger} from "./logger/JsonConsoleLogger";


const cluster = require('cluster');
// worker array that keeps relative PIDs
const workers: any = [];

export class ClusterConfiguration {
    static init(app: any, logger: JsonConsoleLogger) {

        if (cluster.isMaster) {

            // could be used later to create parameterizable number of clusters
            workers.push(cluster.fork());

            // to receive messages from worker process
            workers[0].on('message', function (message: string) {
                logger.log({message, tag: 'system'});
            });

            // process is clustered on a core and process id is assigned
            cluster.on('online', function (worker: any) {
                logger.log({message: 'Worker PID-' + worker.process.pid + ' is listening', tag: 'system'});
            });
            // if any of the worker process dies then start a new one by simply forking another one
            cluster.on('exit', function (worker: any, code: string) {
                logger.logError({message: 'Worker ' + worker.process.pid + ' died with code: ' + code, tag: 'system'});
                logger.log({message: 'Starting a new worker', tag: 'system'});
                const newWorker = cluster.fork();
                workers.push(newWorker);
                // to receive messages from worker process
                newWorker.on('message', function (message: string) {
                    logger.log({message, tag: 'system'});
                });
            });

            cluster.on('listening', (worker: any, address: any) => {
                logger.log({
                    message: 'Worker PID-' + worker.process.pid + ' is now connected to port: ' + address.port,
                    tag: 'system'
                });
            });
        } else {
            app.listen(config.port);
        }

    }
}
