import {Request, Response, Router} from 'express';
import {JsonConsoleLogger} from "../../logger/JsonConsoleLogger";
import {NamespacesHandler} from "../../handlers/NamespacesHandler";
import {InputValidationException} from "../../exceptions/InputValidationException";
import {NotFoundException} from "../../exceptions/NotFoundException";
import {HttpResponseCodes} from "../../const/HttpResponseCodes";

const router: Router = Router();
const logger = new JsonConsoleLogger();
const namespaceHandler = new NamespacesHandler();

/**
 * @swagger
 *
 * /namespaces:
 *   get:
 *     tags:
 *     - "Namespaces"
 *     description: Get list of all namespaces
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Fetched listing of all namespaces
 *         schema:
 *           type: "array"
 *           items:
 *             $ref: "#/components/schemas/Namespaces"
 *       500:
 *         description: unidentified error
 */
router.get('/',
    async (req: Request, res: Response) => {
        try {
            const response = await namespaceHandler.getAll();
            res.send(response);
            logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
        } catch (e) {
            logger.logError({message: e.message, stack: e.stack, tag: "manager"});
            res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
        }
    });

/**
 * @swagger
 *
 * /namespaces:
 *   post:
 *     tags:
 *     - Namespaces
 *     description: Create or update namespace
 *     requestBody:
 *       description: A namespace object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Namespaces"
 *     responses:
 *       200:
 *         description: valid response
 *       409:
 *         description: Invalid UUID provided
 *       500:
 *         description: unidentified error
 */
router.post('/',
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
            logger.logError({message: e.message, stack: e.stack, tag: "manager"});
        }
    });

/**
 * @swagger
 *
 * /namespaces/{namespaceId}:
 *   delete:
 *     tags:
 *     - Namespaces
 *     description: Delete namespace by ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: namespaceId
 *         description: Id of namespace.
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: deleted namespace
 *       409:
 *         description: Invalid UUID provided
 */
router.delete('/:api',
    async (req: Request, res: Response) => {
        try {
            const api = req.params.api;
            await namespaceHandler.deleteOne(api, req.url);
            const response = {delete: true};
            res.send(response);
            logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
        } catch (e) {
            logger.logError({message: e.message, stack: e.stack, tag: "manager"});
            res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
        }
    });

/**
 * @swagger
 *
 * /namespaces/recursive/{namespaceId}:
 *   delete:
 *     tags:
 *     - Namespaces
 *     description: Recursive delete of namespace by ID and all related routing
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: namespaceId
 *         description: Id of namespace.
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: deleted namespace
 *       409:
 *         description: Invalid UUID provided
 *       500:
 *         description: unidentified error
 */
router.delete('/recursive/:api',
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
            logger.logError({message: e.message, stack: e.stack, tag: "manager"});
        }
    });

/**
 * @swagger
 *
 * /namespaces/{namespaceId}:
 *   get:
 *     tags:
 *     - Namespaces
 *     description: Get a namespace by id
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
 *         description: Get a namespace details
 *         schema:
 *           $ref: "#/components/schemas/Namespaces"
 *       409:
 *         description: Invalid UUID provided
 *       404:
 *         description: UUID does not exist
 *       500:
 *         description: unidentified error
 */
router.get('/:api',
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
            logger.logError({message: e.message, stack: e.stack, tag: "manager"});
        }
    });

/**
 * @swagger
 *
 * /namespaces/build/{namespaceId}:
 *   get:
 *     tags:
 *     - Namespaces
 *     description: Get a flat routing table related to a namespace id
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
 *         description: Get a flat routing table by namespace
 *       409:
 *         description: Invalid UUID provided
 *       404:
 *         description: UUID does not exist
 *       500:
 *         description: unidentified error
 */
router.get('/build/:namespace',
    async (req: Request, res: Response) => {
        try {
            const api = req.params.namespace;
            const response = await namespaceHandler.buildRoute(api, req.url);
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
            res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
        }
    });

/***************************************************************************************/

/**
 * @swagger
 *
 * /namespaces/swagger:
 *   get:
 *     tags:
 *     - Namespaces
 *     description: Generate full tree from swagger (WIP)
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success import
 *     deprecated: true
 */
router.post(
    "/swagger",
    async (req: Request, res: Response) => {
        await namespaceHandler.generateFromSwagger(req, res);
    });


export const NamespacesRouter: Router = router;
