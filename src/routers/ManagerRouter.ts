import {Response, Router, Request} from 'express';
import {JsonConsoleLogger} from "../logger/JsonConsoleLogger";
import {NamespacesHandler} from "../handlers/NamespacesHandler";
import {ResourcesHandler} from "../handlers/ResourcesHandler";
import {MethodsHandler} from "../handlers/MethodsHandler";
import {ProxyHandler} from "../handlers/ProxyHandler";
import {ConsumersHandler} from "../handlers/ConsumersHandler";
import {KeysHandler} from "../handlers/KeysHandler";


const router: Router = Router();
const logger = new JsonConsoleLogger();
const namespaceHandler = new NamespacesHandler(logger);
const resourceHandler = new ResourcesHandler(logger);
const methodsHandler = new MethodsHandler(logger);
const proxyHandler = new ProxyHandler(logger);
const consumerHandler = new ConsumersHandler(logger);
const keyHandler = new KeysHandler(logger);


// restart the server in order to reconsider the new routes
router.get('/restartPoints', async (req: Request, res: Response) => {
    await namespaceHandler.startAll(req, res);
});
/***************************************************************************************/

// generate routes from the tree view
router.get('/proxies/build/:namespace', async (req: Request, res: Response) => {
    const api = req.params.namespace;
    await namespaceHandler.buildRoute(req, res, api);
});

// save routes to proxy data
router.post('/proxies/save', async (req: Request, res: Response) => {
    await proxyHandler.saveRoutes(req, res);
});

// get all proxies of a namespace
router.get('/proxies/:namespace', async (req: Request, res: Response) => {
    const namespaceId = req.params.namespace;
    await proxyHandler.getAllByNamespace(req, res, namespaceId);
});

// get all proxies
router.get('/proxies', async (req: Request, res: Response) => {
    await proxyHandler.getAll(req, res);
});

/***************************************************************************************/

// get all namespaces
router.get('/namespaces', async (req: Request, res: Response) => {
    await namespaceHandler.getAll(req, res);
});

// create or update namespaces
router.post('/namespaces', async (req: Request, res: Response) => {
    await namespaceHandler.addOrUpdate(req, res);
});

// delete an namespace by id
router.delete('/namespaces/:api', async (req: Request, res: Response) => {
    const api = req.params.api;
    await namespaceHandler.deleteRecursiveOne(req, res, api);
});

// delete a namespace by id (recursive)
router.delete('/namespaces/recursive/:api', async (req: Request, res: Response) => {
    const api = req.params.api;
    await namespaceHandler.deleteRecursiveOne(req, res, api);
});

// get an namespace by id
router.get('/namespaces/:api', async (req: Request, res: Response) => {
    const api = req.params.api;
    await namespaceHandler.getById(req, res, api);
});

/***************************************************************************************/

// get all dynamic resources
router.get('/resources', async (req: Request, res: Response) => {
    await resourceHandler.getAll(req, res);
});

// create or update resource
router.post('/resources', async (req: Request, res: Response) => {
    await resourceHandler.addOrUpdate(req, res);
});

// delete an resource by id
router.delete('/resources/:api', async (req: Request, res: Response) => {
    const api = req.params.api;
    await resourceHandler.deleteOne(req, res, api);
});

// get an resource by id
router.get('/resources/:api', async (req: Request, res: Response) => {
    const api = req.params.api;
    await resourceHandler.getById(req, res, api);
});

// get a resource by id
router.get('/resources/:api/methods', async (req: Request, res: Response) => {
    const api = req.params.api;
    await resourceHandler.getByIdMethods(req, res, api);
});

// get a resource by Namespace id
router.get('/resources/namespace/:api', async (req: Request, res: Response) => {
    const api = req.params.api;
    await resourceHandler.getTreeByNamespace(req, res, api);
});

/*************************************************************************************/

// get all methods
router.get('/methods', async (req: Request, res: Response) => {
    await methodsHandler.getAll(req, res);
});

// create or update method
router.post('/methods', async (req: Request, res: Response) => {
    await methodsHandler.addOrUpdate(req, res);
});

// delete a method by id
router.delete('/methods/:api', async (req: Request, res: Response) => {
    const api = req.params.api;
    await methodsHandler.deleteOne(req, res, api);
});

// get a method by id
router.get('/methods/:api', async (req: Request, res: Response) => {
    const api = req.params.api;
    await methodsHandler.getById(req, res, api);
});

/***************************************************************************************/
// get all consumers
router.get('/consumers', async (req: Request, res: Response) => {
    await consumerHandler.getAll(req, res);
});

// delete a consumer by id
router.delete('/consumers/:api', async (req: Request, res: Response) => {
    const api = req.params.api;
    await consumerHandler.deleteOne(req, res, api);
});

// get a consumer by id
router.get('/consumers/:api', async (req: Request, res: Response) => {
    const api = req.params.api;
    await consumerHandler.getById(req, res, api);
});

// create or update consumer
router.post('/consumers', async (req: Request, res: Response) => {
    await consumerHandler.addOrUpdate(req, res);
});
/***************************************************************************************/

// get all API keys
router.get('/apiKeys', async (req: Request, res: Response) => {
    await keyHandler.getAll(req, res);
});

// delete a  API key by id
router.delete('/apiKeys/:api', async (req: Request, res: Response) => {
    const api = req.params.api;
    await keyHandler.deleteOne(req, res, api);
});

// get a  API key by id
router.get('/apiKeys/:api', async (req: Request, res: Response) => {
    const api = req.params.api;
    await keyHandler.getById(req, res, api);
});

// get a  API key by ConsumerId
router.get('/apiKeys/consumer/:api', async (req: Request, res: Response) => {
    const api = req.params.api;
    await keyHandler.getByConsumerId(req, res, api);
});

// create or update  API keys
router.post('/apiKeys', async (req: Request, res: Response) => {
    await keyHandler.addOrUpdate(req, res);
});
/***************************************************************************************/

export const ManagerRouter: Router = router;
