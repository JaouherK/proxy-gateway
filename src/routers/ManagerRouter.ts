import {Request, Response, Router} from 'express';
import {JsonConsoleLogger} from "../logger/JsonConsoleLogger";
import {NamespacesHandler} from "../handlers/NamespacesHandler";
import {ResourcesHandler} from "../handlers/ResourcesHandler";
import {MethodsHandler} from "../handlers/MethodsHandler";
import {ProxyHandler} from "../handlers/ProxyHandler";
import {ConsumersHandler} from "../handlers/ConsumersHandler";
import {KeysHandler} from "../handlers/KeysHandler";
import {InputValidationException} from "../exceptions/InputValidationException";
import {NotFoundException} from "../exceptions/NotFoundException";
import {checkJwt} from "../middlewares/checkJwt";
import {checkRole} from "../middlewares/checkRole";
import {UserHandler} from "../handlers/UserHandler";
import {HttpResponseCodes} from "../const/HttpResponseCodes";


const router: Router = Router();
const logger = new JsonConsoleLogger();
const namespaceHandler = new NamespacesHandler();
const resourceHandler = new ResourcesHandler();
const methodsHandler = new MethodsHandler();
const proxyHandler = new ProxyHandler();
const consumerHandler = new ConsumersHandler();
const keyHandler = new KeysHandler(logger);
const userHandler = new UserHandler(logger);

// restart the server in order to reconsider the new routes
router.get('/restartPoints', async (req: Request, res: Response) => {
    try {
        logger.logSecurity({
            managing_route: req.url,
            payload: req.body,
            process: '♥ FailSafe reloading routes',
            tag: 'manager'
        });
        res.status(HttpResponseCodes.Ok).send({status: HttpResponseCodes.Ok});
        process.kill(process.pid);
    } catch (e) {
        logger.logError({
            message: e
        });
        res.sendStatus(HttpResponseCodes.NotFound);
    }
});

/******************************PROXIES ************************************/

// save routes to proxy data
router.post('/proxies/save',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        try {
            const response = await proxyHandler.saveRoutes(req.body);
            res.send(response);
            logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
        } catch (e) {
            res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
            logger.logError({message: e, tag: "manager"});
        }
    });

// get all proxies of a namespace
router.get('/proxies/:namespace',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        try {
            const namespaceId = req.params.namespace;
            const response = await proxyHandler.getAllByNamespace(namespaceId);
            logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
            res.send(response);
        } catch (e) {
            if (e instanceof InputValidationException) {
                res.status(HttpResponseCodes.Conflict).send({error: e.message});
            } else {
                res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
            }
            logger.logError({message: e, tag: "manager"});
        }
    });

// get all proxies
router.get('/proxies',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        try {
            const response = await proxyHandler.getAll();
            logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
            res.send(response);
        } catch (e) {
            logger.logError({message: e, tag: "manager"});
            res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
        }
    });

// delete a proxy by ID
router.delete('/proxies/:proxyId',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        try {
            const proxyId = req.params.proxyId;
            const response = await proxyHandler.deleteOne(proxyId);

            res.send(response);
            logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
        } catch (e) {
            if (e instanceof InputValidationException) {
                res.status(HttpResponseCodes.Conflict).send({error: e.message});
            } else {
                res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
            }
            logger.logError({message: e, tag: "manager"});
        }
    });

// check if a proxy exists by id
router.get('/proxies/exist/:proxyId',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        try {
            const proxyId = req.params.proxyId;
            const response = await proxyHandler.existById(proxyId);
            res.send(response);
            logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
        } catch (e) {
            if (e instanceof InputValidationException) {
                res.status(HttpResponseCodes.Conflict).send({error: e.message});
            } else if (e instanceof NotFoundException) {
                res.status(HttpResponseCodes.NotFound).send({error: e.message});
            } else {
                res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
            }
            logger.logError({message: e, tag: "manager"});
        }
    });

/***************************** NAMESPACE ****************************************/
// get all namespaces
router.get('/namespaces',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        try {
            const response = await namespaceHandler.getAll();
            res.send(response);
            logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
        } catch (e) {
            logger.logError({message: e, tag: "manager"});
            res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
        }
    });

// create or update namespace
router.post('/namespaces',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        try {
            const response = await namespaceHandler.addOrUpdate(req.body, req.url);
            res.send(response);
            logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
        } catch (e) {
            if (e instanceof InputValidationException) {
                res.status(HttpResponseCodes.Conflict).send({error: e.message});
            } else if (e instanceof NotFoundException) {
                res.status(HttpResponseCodes.NotFound).send({error: e.message});
            } else {
                res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
            }
            logger.logError({message: e, tag: "manager"});
        }
    });

// delete an namespace by id
router.delete('/namespaces/:api',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        try {
            const api = req.params.api;
            await namespaceHandler.deleteOne(api, req.url);
            const response = {delete: true};
            res.send(response);
            logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
        } catch (e) {
            logger.logError({message: e, tag: "manager"});
            res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
        }
    });

// delete recursive namespace
router.delete('/namespaces/recursive/:api',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        try {
            const api = req.params.api;
            await namespaceHandler.deleteRecursiveOne(api, req.url);
            const response = {delete: true};
            res.send(response);
            logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
        } catch (e) {
            if (e instanceof InputValidationException) {
                res.status(HttpResponseCodes.Conflict).send({error: e.message});
            } else {
                res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
            }
            logger.logError({message: e, tag: "manager"});
        }
    });

// get a namespace by id
router.get('/namespaces/:api',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        try {
            const api = req.params.api;
            const response = await namespaceHandler.getById(api, req.url);
            res.send(response);
            logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
        } catch (e) {
            if (e instanceof InputValidationException) {
                res.status(HttpResponseCodes.Conflict).send({error: e.message});
            } else if (e instanceof NotFoundException) {
                res.status(HttpResponseCodes.NotFound).send({error: e.message});
            } else {
                res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
            }
            logger.logError({message: e, tag: "manager"});
        }
    });

// build route tree
router.get('/proxies/build/:namespace',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        try {
            const api = req.params.namespace;
            const response = await namespaceHandler.buildRoute(api, req.url);
            res.send(response);

            logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
        } catch (e) {
            logger.logError({message: e, tag: "manager"});
            res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
        }
    });


/***************************************************************************************/
//test element
router.post(
    "/swagger",
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        await namespaceHandler.generateFromSwagger(req, res);
    });

/******************************** RESOURCES *************************************/
// get all dynamic resources
router.get('/resources',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        try {
            const response = await resourceHandler.getAll();
            res.send(response);

            logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
        } catch (e) {
            logger.logError({message: e, tag: "manager"});
            res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
        }
    });

// delete a resource by id
router.delete('/resources/:api',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        try {
            const api = req.params.api;
            await resourceHandler.deleteOne(api, req.url);
            const response = {delete: true};
            res.send(response);
            logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
        } catch (e) {
            if (e instanceof InputValidationException) {
                res.status(HttpResponseCodes.Conflict).send({error: e.message});
            } else {
                res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
            }
            logger.logError({message: e, tag: "manager"});
        }
    });

// create or update resource
router.post('/resources',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        try {
            const response = await resourceHandler.addOrUpdate(req.body, req.url);
            res.send(response);
            logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
        } catch (e) {
            if (e instanceof InputValidationException) {
                res.status(HttpResponseCodes.Conflict).send({error: e.message});
            } else if (e instanceof NotFoundException) {
                res.status(HttpResponseCodes.NotFound).send({error: e.message});
            } else {
                res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
            }
            logger.logError({message: e, tag: "manager"});
        }
    });

// get resource by id
router.get('/resources/:api',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        try {
            const api = req.params.api;
            const response = await resourceHandler.getById(api, req.url);
            res.send(response);

            logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
        } catch (e) {
            logger.logError({message: e, tag: "manager"});
            res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
        }
    });

// get an end point by Namespace id
router.get('/resources/namespace/:api',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        try {
            const api = req.params.api;
            const response = await resourceHandler.getTreeByNamespace(api, req.url);

            res.send(response);
            logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
        } catch (e) {
            if (e instanceof InputValidationException) {
                res.status(HttpResponseCodes.Conflict).send({error: e.message});
            } else {
                res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
            }
            logger.logError({message: e, tag: "manager"});
        }
    });

// get an end point by id
router.get('/resources/:api/methods',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        try {
            const api = req.params.api;
            const response = await resourceHandler.getByIdMethods(api, req.url);
            res.send(response);
            logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
        } catch (e) {
            if (e instanceof InputValidationException) {
                res.status(HttpResponseCodes.Conflict).send({error: e.message});
            } else if (e instanceof NotFoundException) {
                res.status(HttpResponseCodes.NotFound).send({error: e.message});
            } else {
                res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
            }
            logger.logError({message: e, tag: "manager"});
        }
    });

/********************************* METHODS ************************************/
// get all dynamic methods
router.get('/methods', async (req: Request, res: Response) => {
    try {
        const response = await methodsHandler.getAll();
        res.send(response);

        logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
    } catch (e) {
        logger.logError({message: e, tag: "manager"});
        res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
    }
});

// delete a method
router.delete('/methods/:api', async (req: Request, res: Response) => {
    try {
        const api = req.params.api;
        await methodsHandler.deleteOne(api, req.url);
        const response = {delete: true};
        res.send(response);
        logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
    } catch (e) {
        if (e instanceof InputValidationException) {
            res.status(HttpResponseCodes.Conflict).send({error: e.message});
        } else {
            res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
        }
        logger.logError({message: e, tag: "manager"});
    }
});

// create or update endpoints
router.post('/methods', async (req: Request, res: Response) => {
    try {
        const response = await methodsHandler.addOrUpdate(req.body, req.url);

        res.send(response);
        logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
    } catch (e) {
        if (e instanceof InputValidationException) {
            res.status(HttpResponseCodes.Conflict).send({error: e.message});
        } else if (e instanceof NotFoundException) {
            res.status(HttpResponseCodes.NotFound).send({error: e.message});
        } else {
            res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
        }
        logger.logError({message: e, tag: "manager"});
    }
});


// get a method by id
router.get('/methods/:api', async (req: Request, res: Response) => {
    try {
        const api = req.params.api;
        const response = await methodsHandler.getById(api, req.url);

        res.send(response);
        logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
    } catch (e) {
        if (e instanceof InputValidationException) {
            res.status(HttpResponseCodes.Conflict).send({error: e.message});
        } else if (e instanceof NotFoundException) {
            res.status(HttpResponseCodes.NotFound).send({error: e.message});
        } else {
            res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
        }
        logger.logError({message: e, tag: "manager"});
    }
});

/***************************************************************************************/
// get all consumers
router.get('/consumers',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        try {
            const response = await consumerHandler.getAll();
            res.send(response);
            logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
        } catch (e) {
            logger.logError({message: e, tag: "manager"});
            res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
        }
    });

// delete a consumer by id
router.delete('/consumers/:api',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        try {
            const api = req.params.api;
            const response = await consumerHandler.deleteOne(req.url, api);
            res.send(response);
            logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
        } catch (e) {
            if (e instanceof InputValidationException) {
                res.status(HttpResponseCodes.Conflict).send({error: e.message});
            } else {
                res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
            }
            logger.logError({message: e, tag: "manager"});
        }
    });

// get a consumer by id
router.get('/consumers/:api',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        try {
            const api = req.params.api;
            const response = await consumerHandler.getById(req.url, api);
            res.send(response);
            logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
        } catch (e) {
            if (e instanceof InputValidationException) {
                res.status(HttpResponseCodes.Conflict).send({error: e.message});
            } else if (e instanceof NotFoundException) {
                res.status(HttpResponseCodes.NotFound).send({error: e.message});
            } else {
                res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
            }
            logger.logError({message: e, tag: "manager"});
        }
    });

// create or update consumer
router.post('/consumers',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        try {
            const payload = req.body;
            const response = await consumerHandler.addOrUpdate(req);
            res.send(response);
            logger.log({managing_route: req.url, payload, response, tag: "manager"});
        } catch (e) {
            if (e instanceof InputValidationException) {
                res.status(HttpResponseCodes.Conflict).send({error: e.message});
            } else if (e instanceof NotFoundException) {
                res.status(HttpResponseCodes.NotFound).send({error: e.message});
            } else {
                res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
            }
            logger.logError({message: e, tag: "manager"});
        }
    });
/***************************************************************************************/

// get all API keys
router.get('/apiKeys',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        await keyHandler.getAll(req, res);
    });

// delete a  API key by id
router.delete('/apiKeys/:api',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        const api = req.params.api;
        await keyHandler.deleteOne(req, res, api);
    });

// get a  API key by id
router.get('/apiKeys/:api',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        const api = req.params.api;
        await keyHandler.getById(req, res, api);
    });

// get a  API key by ConsumerId
router.get('/apiKeys/consumer/:api',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        const api = req.params.api;
        await keyHandler.getByConsumerId(req, res, api);
    });

// create or update  API keys
router.post('/apiKeys',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        await keyHandler.addOrUpdate(req, res);
    });
/***************************************************************************************/

//Get all users
router.get("/user",
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        await userHandler.getAll(req, res);
    });

// Get one user
router.get(
    "/user/:id",
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        const id = req.params.id;
        await userHandler.getById(req, res, id);
    }
);

//Create a new user
router.post("/user",
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        await userHandler.createUser(req, res);
    });

//Edit one user
router.patch(
    "/user/:id",
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        const id = req.params.id;
        await userHandler.editUser(req, res, id);
    }
);

//Delete one user
router.delete(
    "/user/:id",
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        const id = req.params.id;
        await userHandler.deleteOne(req, res, id);
    }
);

/***************************************************************************************/

export const ManagerRouter: Router = router;
