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


const router: Router = Router();
const logger = new JsonConsoleLogger();
const namespaceHandler = new NamespacesHandler(logger);
const resourceHandler = new ResourcesHandler(logger);
const methodsHandler = new MethodsHandler(logger);
const proxyHandler = new ProxyHandler();
const consumerHandler = new ConsumersHandler(logger);
const keyHandler = new KeysHandler(logger);
const userHandler = new UserHandler(logger);

// restart the server in order to reconsider the new routes
router.get('/restartPoints', async (req: Request, res: Response) => {
    await namespaceHandler.startAll(req, res);
});

// generate routes from the tree view
router.get('/proxies/build/:namespace', async (req: Request, res: Response) => {
    const api = req.params.namespace;
    await namespaceHandler.buildRoute(req, res, api);
});
/***************************************************************************************/

// save routes to proxy data
router.post('/proxies/save',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        try {
            const response = await proxyHandler.saveRoutes(req.body);
            res.send(response);
            logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
        } catch (e) {
            res.status(500).send({error: e.message});
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
                res.status(409).send({error: e.message});
            } else {
                res.status(500).send({error: e.message});
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
            res.status(500).send({error: e.message});
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
                res.status(409).send({error: e.message});
            } else {
                res.status(500).send({error: e.message});
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
                res.status(409).send({error: e.message});
            } else if (e instanceof NotFoundException) {
                res.status(404).send({error: e.message});
            } else {
                res.status(500).send({error: e.message});
            }
            logger.logError({message: e, tag: "manager"});
        }
    });

/***************************************************************************************/

// get all namespaces
router.get('/namespaces',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        await namespaceHandler.getAll(req, res);
    });

// create or update namespaces
router.post('/namespaces',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        await namespaceHandler.addOrUpdate(req, res);
    });

// delete an namespace by id
router.delete('/namespaces/:api',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        const api = req.params.api;
        await namespaceHandler.deleteRecursiveOne(req, res, api);
    });

// delete a namespace by id (recursive)
router.delete('/namespaces/recursive/:api',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        const api = req.params.api;
        await namespaceHandler.deleteRecursiveOne(req, res, api);
    });

// get an namespace by id
router.get('/namespaces/:api',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        const api = req.params.api;
        await namespaceHandler.getById(req, res, api);
    });

/***************************************************************************************/
//test element
router.post(
    "/swagger",
    async (req: Request, res: Response) => {
        await namespaceHandler.generateFromSwagger(req, res);
    });

/***************************************************************************************/

// get all dynamic resources
router.get('/resources',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        await resourceHandler.getAll(req, res);
    });

// create or update resource
router.post('/resources',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        await resourceHandler.addOrUpdate(req, res);
    });

// delete an resource by id
router.delete('/resources/:api',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        const api = req.params.api;
        await resourceHandler.deleteOne(req, res, api);
    });

// get an resource by id
router.get('/resources/:api',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        const api = req.params.api;
        await resourceHandler.getById(req, res, api);
    });

// get a resource by id
router.get('/resources/:api/methods',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        const api = req.params.api;
        await resourceHandler.getByIdMethods(req, res, api);
    });

// get a resource by Namespace id
router.get('/resources/namespace/:api',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        const api = req.params.api;
        await resourceHandler.getTreeByNamespace(req, res, api);
    });

/*************************************************************************************/

// get all methods
router.get('/methods',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        await methodsHandler.getAll(req, res);
    });

// create or update method
router.post('/methods',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        await methodsHandler.addOrUpdate(req, res);
    });

// delete a method by id
router.delete('/methods/:api',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        const api = req.params.api;
        await methodsHandler.deleteOne(req, res, api);
    });

// get a method by id
router.get('/methods/:api',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        const api = req.params.api;
        await methodsHandler.getById(req, res, api);
    });

/***************************************************************************************/
// get all consumers
router.get('/consumers',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        await consumerHandler.getAll(req, res);
    });

// delete a consumer by id
router.delete('/consumers/:api',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        const api = req.params.api;
        await consumerHandler.deleteOne(req, res, api);
    });

// get a consumer by id
router.get('/consumers/:api',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        const api = req.params.api;
        await consumerHandler.getById(req, res, api);
    });

// create or update consumer
router.post('/consumers',
    [checkJwt, checkRole(["ADMIN"])],
    async (req: Request, res: Response) => {
        await consumerHandler.addOrUpdate(req, res);
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
