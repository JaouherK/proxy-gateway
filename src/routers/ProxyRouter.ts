import {Request, Response, Router} from 'express';
import {ProxyProcessData} from "../api/ProxyProcessData";
import proxy = require("express-http-proxy");
import {JsonConsoleLogger} from "../logger/jsonConsoleLogger";

export class ProxyRouter {

    static getRouter(prox: ProxyProcessData, logger: JsonConsoleLogger): Router {
        const router: Router = Router();
        let logAuth = '';
        //  authentication / authorization lvl0
        if (prox.authType === 'jwt') {
            logAuth = ' uses jwt auth';
        }

        if (prox.authType === 'apiKey') {
            logAuth = ' uses apiKey auth';
        }

        // manage if this is a mock
        if (prox.integrationType === 'MOCK') {
            router.use((req: Request, res: Response) => {
                logger.log({
                    message: prox.url + ' (mocked route) requested' + logAuth,
                    body: req.body,
                    response: JSON.parse(prox.mockResponseBody),
                    tag: prox.namespace
                });
                res.setHeader('Content-Type', prox.mockResponseContent);
                res.status(prox.mockResponseCode).send(prox.mockResponseBody);
            });
        }

        // manage if this is a a http request
        if (prox.integrationType === 'HTTP') {

            router.use('*', proxy(prox.endpointUrl, {
                https: prox.https,
                parseReqBody: prox.denyUpload,
                limit: prox.limit,
                timeout: prox.timeout,
                memoizeHost: false,

                proxyReqPathResolver: (req: Request) => {
                    const route = prox.endpointUrl.split('/');
                    const params = req.params[0].slice(1).split('/');
                    const queryString = req.url.split('?')[1];

                    const prefix = prox.https ? 'https://' : 'http://';
                    const endPoint = this.buildUrl(this.paramsResolver(route, params), queryString);

                    return prefix + endPoint;
                },

                filter(req: Request) {
                    return req.method === prox.method;
                },

                // this is mostly for logging reasons (can be used to decorate the data response)
                userResDecorator(proxyRes, proxyResData, userReq) {
                    const data = {data: proxyResData.toString('utf8')};
                    logger.log({
                        message: userReq.originalUrl + ' requested' + logAuth + ' routed to ' + prox.endpointUrl,
                        body: userReq.body,
                        response: data,
                        tag: prox.namespace
                    });
                    return proxyResData;
                }
            }));
        }
        return router;
    }

    // resolve route that are expecting parameters with incoming params
    // this will through extra parameters that are not mapped in target
    private static paramsResolver(route: string[], params: string[]): string [] {
        return route.map((element) => {
            // regex test that starts with :
            if (/^:/.test(element)) {
                const smallShift = params.shift();
                if (smallShift !== undefined) {
                    element = smallShift;
                }
            }
            return element;
        });
    }

    // build url from array of strings
    private static buildUrl(route: string[], params: string): string {
        if (params) {
            return route.join('/') + '?' + params;
        } else {
            return route.join('/');
        }
    }
}
