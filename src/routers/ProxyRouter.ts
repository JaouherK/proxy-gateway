import {Request, Response, Router} from 'express';
import {ProxyDomain} from "../domains/ProxyDomain";
import {JsonConsoleLogger} from "../logger/JsonConsoleLogger";
import {checkJwtMiddleware} from "../middlewares/CheckJwtMiddleware";
import proxy = require("express-http-proxy");

const uuid = require('uuid-v4');
let parameters: any[];
let targetUrl: string;

export class ProxyRouter {

    static getRouter(prox: ProxyDomain, logger: JsonConsoleLogger): Router {
        const router: Router = Router();
        let logAuth = '';

        if (prox.authType === 'jwt') {
            logAuth = ' uses jwt auth';
            router.use(checkJwtMiddleware);
        }

        if (prox.authType === 'apiKey') {
            // todo: use API Key validation middleware
            logAuth = ' uses apiKey auth';
        }

        /*************Rate limiting ***********************/

        const rateLimit = require("express-rate-limit");
        const apiLimiter = rateLimit({
            windowMs: 5000, // 1 second
            max: 1
        });


        /******************** End *****************************/

        // manage if this is a mock
        if (prox.integrationType === 'MOCK') {
            router.use((req: Request, res: Response, next) => {
                const uri = req.originalUrl.split('?')[0];
                const url = this.buildFromProxy(prox.url, uri);
                if (
                    (prox.method.toLowerCase() !== req.method.toLowerCase())
                    || (req.originalUrl !== url)
                ) {
                    return next();
                }
                logger.log({
                    message: '(' + req.method + ')' + prox.url + req.url + ' (mocked route) requested' + logAuth,
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

            router.use('*', apiLimiter, proxy(prox.endpointUrl, {
                https: prox.https,
                parseReqBody: prox.denyUpload,
                limit: prox.limit,
                timeout: prox.timeout,
                memoizeHost: false,

                filter: (req: Request, res: Response) => {
                    const uri = req.originalUrl.split('?')[0];
                    const url = this.buildFromProxy(prox.url, uri);
                    const endUrl = this.buildUrl(url.split('/'), req.originalUrl.split('?')[1]);
                    this.getParams(prox.url, uri);

                    return (
                        (req.method === prox.method) &&
                        (endUrl === req.originalUrl)
                    );
                },

                proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
                    const correlationId = (srcReq.headers['x-correlation-id']) ?
                        srcReq.headers['x-correlation-id'] as string : uuid();
                    // you can update headers
                    if (proxyReqOpts.headers) {
                        proxyReqOpts.headers['x-correlation-id'] = correlationId;
                        srcReq.headers['x-correlation-id'] = correlationId;
                    }

                    return proxyReqOpts;
                },

                proxyReqPathResolver: (req: Request) => {

                    const route = prox.endpointUrl.split('/');
                    const queryString = req.url.split('?')[1];

                    const prefix = prox.https ? 'https://' : 'http://';
                    const endPoint = this.buildUrl(this.paramsResolver(route), queryString);
                    targetUrl = prefix + endPoint;
                    return targetUrl;
                },

                // this is mostly for logging reasons (can be used to decorate the data response)
                userResDecorator(proxyRes, proxyResData, userReq) {
                    let response: any;
                    try {
                        response = JSON.parse(proxyResData.toString('utf8'));
                    } catch (e) {
                        response = {};
                    }
                    const data = {data: response};
                    logger.log({
                        message: '(' + userReq.method + ')' + userReq.originalUrl + ' requested' + logAuth + ' routed to ' + prox.endpointUrl,
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
    private static paramsResolver(route: string[]): string [] {
        return route.map((element) => {
            // regex test that starts with :
            if (/^:/.test(element)) {
                const smallShift = parameters.shift();
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

    private static buildFromProxy(proxyUri: string, reqUri: string): string {
        // if (/^*:*/.test(proxyUri)) {
        if (proxyUri.indexOf(':') === -1) {
            return proxyUri;
        }
        const p = proxyUri.split('/');
        const r = reqUri.split('/');
        p.map((element, key) => {
            if ((/^:/.test(element)) && (typeof r[key] !== undefined)) {
                p[key] = r[key];
            }
        });
        return p.join('/');
    }

    private static getParams(proxyUri: string, reqUri: string) {
        if (proxyUri.indexOf(':') === -1) {
            return;
        }
        parameters = [];
        const p = proxyUri.split('/');
        const r = reqUri.split('/');
        p.map((element, key) => {
            if ((/^:/.test(element)) && (typeof r[key] !== undefined)) {
                parameters.push(r[key]);
            }
        });
    }
}
