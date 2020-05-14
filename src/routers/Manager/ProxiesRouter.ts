import {Request, Response, Router} from 'express';
import {JsonConsoleLogger} from "../../logger/JsonConsoleLogger";
import {ProxyHandler} from "../../handlers/ProxyHandler";
import {InputValidationException} from "../../exceptions/InputValidationException";
import {NotFoundException} from "../../exceptions/NotFoundException";
import {HttpResponseCodes} from "../../const/HttpResponseCodes";

const router: Router = Router();
const logger = new JsonConsoleLogger();
const proxyHandler = new ProxyHandler();

// save routes to proxy data
router.post('/save',
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
router.get('/:namespace',
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
router.get('/',
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
router.delete('/:proxyId',
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
router.get('/exist/:proxyId',
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

export const ProxiesRouter: Router = router;
