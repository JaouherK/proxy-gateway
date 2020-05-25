import {Request, Response, Router} from 'express';
import {JsonConsoleLogger} from "../../logger/JsonConsoleLogger";
import {ResourcesHandler} from "../../handlers/ResourcesHandler";
import {InputValidationException} from "../../exceptions/InputValidationException";
import {NotFoundException} from "../../exceptions/NotFoundException";
import {HttpResponseCodes} from "../../const/HttpResponseCodes";

const router: Router = Router();
const logger = new JsonConsoleLogger();
const resourceHandler = new ResourcesHandler();

/**
 * @swagger
 *
 * /resources:
 *   get:
 *     tags:
 *     - "Resources"
 *     description: Get list of all resources with relative list of methods
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Fetched listing of all resources
 *         schema:
 *           type: "array"
 *           items:
 *             $ref: "#/components/schemas/Resources"
 *       500:
 *         description: Unidentified error
 */
router.get('/',
    async (req: Request, res: Response) => {
        try {
            const response = await resourceHandler.getAll();
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
 * /resources/recursive/{resourceId}:
 *   delete:
 *     tags:
 *     - Resources
 *     description: Recursive delete of resource by ID and all related methods
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: resourceId
 *         description: Id of resource.
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: deleted resource
 *       409:
 *         description: Invalid UUID provided
 *       500:
 *         description: Unidentified error
 */
router.delete('/recursive/:api',
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
            logger.logError({message: e.message, stack: e.stack, tag: "manager"});
        }
    });

/**
 * @swagger
 *
 * /resources:
 *   post:
 *     tags:
 *     - Resources
 *     description: Create or update resource
 *     requestBody:
 *       description: A resource object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Resources"
 *     responses:
 *       200:
 *         description: Valid response
 *       409:
 *         description: Invalid UUID provided
 *       500:
 *         description: Unidentified error
 */
router.post('/',
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
            logger.logError({message: e.message, stack: e.stack, tag: "manager"});
        }
    });

/**
 * @swagger
 *
 * /resources/{resourceId}:
 *   get:
 *     tags:
 *     - Resources
 *     description: Get a resource by id in addition to child resources and methods
 *     parameters:
 *       - name: resourceId
 *         description: Id of resource.
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Get a resource details
 *         schema:
 *           $ref: "#/components/schemas/Resources"
 *       409:
 *         description: Invalid UUID provided
 *       404:
 *         description: UUID does not exist
 *       500:
 *         description: Unidentified error
 */
router.get('/:api',
    async (req: Request, res: Response) => {
        try {
            const api = req.params.api;
            const response = await resourceHandler.getById(api, req.url);
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
 * /namespaces/{namespaceId}:
 *   get:
 *     tags:
 *     - Resources
 *     description: Get a list of resources related to a namespace by id
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
 *         description: Get a list of resources under a namespace
 *         schema:
 *           $ref: "#/components/schemas/Resources"
 *       409:
 *         description: Invalid UUID provided
 *       404:
 *         description: UUID does not exist
 *       500:
 *         description: Unidentified error
 */
router.get('/namespace/:api',
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
            logger.logError({message: e.message, stack: e.stack, tag: "manager"});
        }
    });

/**
 * @swagger
 *
 * /resources/{resourceId}/methods:
 *   get:
 *     tags:
 *     - Resources
 *     description: Get a list of methods related to a resource by id
 *     parameters:
 *       - name: resourceId
 *         description: Id of resource.
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Get a list of methods under a resource
 *         schema:
 *           $ref: "#/components/schemas/Methods"
 *       409:
 *         description: Invalid UUID provided
 *       404:
 *         description: UUID does not exist
 *       500:
 *         description: Unidentified error
 */
router.get('/:api/methods',
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
            logger.logError({message: e.message, stack: e.stack, tag: "manager"});
        }
    });


export const ResourcesRouter: Router = router;
