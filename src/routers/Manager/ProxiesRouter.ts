import {Request, Response, Router} from 'express';
import {JsonConsoleLogger} from "../../logger/JsonConsoleLogger";
import {ProxyHandler} from "../../handlers/ProxyHandler";
import {InputValidationException} from "../../exceptions/InputValidationException";
import {NotFoundException} from "../../exceptions/NotFoundException";
import {HttpResponseCodes} from "../../const/HttpResponseCodes";

const router: Router = Router();
const logger = new JsonConsoleLogger();
const proxyHandler = new ProxyHandler();

/**
 * @swagger
 *
 * /proxies/save:
 *   post:
 *     tags:
 *     - Proxies
 *     description: save routes to proxy data
 *     requestBody:
 *       description: List of Proxy object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: "array"
 *             items:
 *               $ref: "#/components/schemas/Proxies"
 *     responses:
 *       200:
 *         description: valid response
 *       409:
 *         description: Invalid UUID provided
 *       500:
 *         description: unidentified error
 */
router.post('/save',
    async (req: Request, res: Response) => {
        try {
            console.log(req.body, null, 2);
            const response = await proxyHandler.saveRoutes(req.body);
            res.send(response);
            logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
        } catch (e) {
            res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
            logger.logError({message: e.message, stack: e.stack, tag: "manager"});
        }
    });

/**
 * @swagger
 *
 * /proxies/{namespaceId}:
 *   get:
 *     tags:
 *     - Proxies
 *     description: get all proxies of a namespace
 *     parameters:
 *       - name: namespaceId
 *         description: Id of namespace.
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: valid response
 *         schema:
 *           type: "array"
 *           items:
 *             $ref: "#/components/schemas/Proxies"
 *       409:
 *         description: Invalid UUID provided
 *       500:
 *         description: unidentified error
 */
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
            logger.logError({message: e.message, stack: e.stack, tag: "manager"});
        }
    });

/**
 * @swagger
 *
 * /proxies:
 *   get:
 *     tags:
 *     - Proxies
 *     description: get list of all proxies
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: fetched listing of all proxies
 *         schema:
 *           type: "array"
 *           items:
 *             $ref: "#/components/schemas/Proxies"
 */
router.get('/',
    async (req: Request, res: Response) => {
        try {
            const response = await proxyHandler.getAll();
            logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
            res.send(response);
        } catch (e) {
            logger.logError({message: e.message, stack: e.stack, tag: "manager"});
            res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
        }
    });

/**
 * @swagger
 *
 * /proxies/{proxyId}:
 *   delete:
 *     tags:
 *     - Proxies
 *     description: Delete a proxy by ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: proxyId
 *         description: Id of proxy.
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: deleted proxy
 *       409:
 *         description: Invalid UUID provided
 */
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
            logger.logError({message: e.message, stack: e.stack, tag: "manager"});
        }
    });

/**
 * @swagger
 *
 * /proxies/exist/{proxyId}:
 *   get:
 *     tags:
 *     - Proxies
 *     description: check if a proxy exists by id
 *     parameters:
 *       - name: proxyId
 *         description: Id of proxy.
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: true/false response
 *       409:
 *         description: Invalid UUID provided
 *       404:
 *         description: UUID does not exist
 *       500:
 *         description: unidentified error
 */
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
            logger.logError({message: e.message, stack: e.stack, tag: "manager"});
        }
    });

export const ProxiesRouter: Router = router;
