import {Response, Router, Request} from 'express';
import {JsonConsoleLogger} from "../logger/jsonConsoleLogger";
import {NamespacesHandler} from "../http/handlers/NamespacesHandler";
import {ResourcesHandler} from "../http/handlers/ResourcesHandler";
import {MethodsHandler} from "../http/handlers/MethodsHandler";
import {ProxyHandler} from "../http/handlers/ProxyHandler";


const router: Router = Router();
const logger = new JsonConsoleLogger();
const namespaceHandler = new NamespacesHandler(logger);
const resourceHandler = new ResourcesHandler(logger);
const methodsHandler = new MethodsHandler(logger);
const proxyHandler = new ProxyHandler(logger);


// restart the server in order to reconsider the new routes
router.get('/restartPoints', async (req: Request, res: Response) => {
    await namespaceHandler.startAll(req, res);
});
/***************************************************************************************/

router.get('/proxies/build/:namespace', async (req: Request, res: Response) => {
    const api = req.params.namespace;
    await namespaceHandler.buildRoute(req, res, api);
});

router.post('/proxies/save', async (req: Request, res: Response) => {
    await proxyHandler.saveRoutes(req, res);
});

router.get('/proxies/:namespace', async (req: Request, res: Response) => {
    const namespaceId = req.params.namespace;
    await proxyHandler.getAllByNamespace(req, res, namespaceId);
});

router.get('/proxies', async (req: Request, res: Response) => {
    await proxyHandler.getAll(req, res);
});

/***************************************************************************************/

// get all dynamic api end points
router.get('/namespaces', async (req: Request, res: Response) => {
    await namespaceHandler.getAll(req, res);
});

// create or update endpoints
router.post('/namespaces', async (req: Request, res: Response) => {
    await namespaceHandler.addOrUpdate(req, res);
});

// delete an end point by id
router.delete('/namespaces/:api', async (req: Request, res: Response) => {
    const api = req.params.api;
    await namespaceHandler.deleteOne(req, res, api);
});

// delete an end point by id
router.delete('/namespaces/recursive/:api', async (req: Request, res: Response) => {
    const api = req.params.api;
    await namespaceHandler.deleteRecursiveOne(req, res, api);
});

// get an end point by id
router.get('/namespaces/:api', async (req: Request, res: Response) => {
    const api = req.params.api;
    await namespaceHandler.getById(req, res, api);
});

/***************************************************************************************/
// get all dynamic resources
router.get('/resources', async (req: Request, res: Response) => {
    await resourceHandler.getAll(req, res);
});

// create or update endpoints
router.post('/resources', async (req: Request, res: Response) => {
    await resourceHandler.addOrUpdate(req, res);
});

// delete an end point by id
router.delete('/resources/:api', async (req: Request, res: Response) => {
    const api = req.params.api;
    await resourceHandler.deleteOne(req, res, api);
});

// get an end point by id
router.get('/resources/:api', async (req: Request, res: Response) => {
    const api = req.params.api;
    await resourceHandler.getById(req, res, api);
});

// get an end point by id
router.get('/resources/:api/methods', async (req: Request, res: Response) => {
    const api = req.params.api;
    await resourceHandler.getByIdMethods(req, res, api);
});

// get an end point by Namespace id
router.get('/resources/namespace/:api', async (req: Request, res: Response) => {
    const api = req.params.api;
    await resourceHandler.getTreeByNamespace(req, res, api);
});

/*************************************************************************************/
// get all dynamic resources
router.get('/methods', async (req: Request, res: Response) => {
    await methodsHandler.getAll(req, res);
});

// create or update endpoints
router.post('/methods', async (req: Request, res: Response) => {
    await methodsHandler.addOrUpdate(req, res);
});

// delete an end point by id
router.delete('/methods/:api', async (req: Request, res: Response) => {
    const api = req.params.api;
    await methodsHandler.deleteOne(req, res, api);
});

// get an end point by id
router.get('/methods/:api', async (req: Request, res: Response) => {
    const api = req.params.api;
    await methodsHandler.getById(req, res, api);
});

/***************************************************************************************/

export const ManagerRouter: Router = router;
