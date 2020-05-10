import {ManagerRouter} from "./ManagerRouter";
import {ProxyRouter} from "./ProxyRouter";
import {JsonConsoleLogger} from "../logger/jsonConsoleLogger";
import {HttpResponseCodes} from "../const/HttpResponseCodes";
import {ProxyHandler} from "../handlers/ProxyHandler";
import {ProxyDomain} from "../domains/ProxyDomain";
import {AuthenticationRouter} from "./AuthenticationRouter";

export class MainRouter {

    static init(app: any, logger: JsonConsoleLogger) {
        MainRouter.initGeneralConfig(app, logger);
        MainRouter.initGenericProxy(app, logger);
    }


    static initGeneralConfig(app: any, logger: JsonConsoleLogger) {
        // Health Check endpoint
        app.get('/_healthCheck', function (req: any, res: any) {
            res.sendStatus(HttpResponseCodes.Ok);
            logger.log({message: 'Health check performed', tag: 'system'});
        });

        // Admin route
        app.use('/manager', ManagerRouter);

        // User account route
        app.use('/account', AuthenticationRouter);
    }

    static initGenericProxy(app: any, logger: JsonConsoleLogger) {
        // advanced APIs proxy
        ProxyHandler.getAllProxyMappings(logger).then((proxies: ProxyDomain[]) => {
                proxies.forEach((proxy: ProxyDomain) => {
                    app.use(proxy.url, ProxyRouter.getRouter(proxy, logger));
                    logger.log({message: 'Route ' + proxy.url + '(' + proxy.method + ') deployed', tag: 'cluster'});
                });
                app.use(function (req: any, res: any, next: any) {
                    logger.logError({message: '404 - Route ' + req.url + ' Not found.', tag: '404'});
                    return res.status(HttpResponseCodes.NotFound).send({error: '404 - Route ' + req.url + ' Not found.'});
                });
            }
        ).catch(err => logger.logError(err));
    }
}
