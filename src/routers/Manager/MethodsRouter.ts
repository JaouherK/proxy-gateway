import {Request, Response, Router} from 'express';
import {JsonConsoleLogger} from "../../logger/JsonConsoleLogger";
import {MethodsHandler} from "../../handlers/MethodsHandler";
import {InputValidationException} from "../../exceptions/InputValidationException";
import {NotFoundException} from "../../exceptions/NotFoundException";
import {HttpResponseCodes} from "../../const/HttpResponseCodes";

const router: Router = Router();
const logger = new JsonConsoleLogger();
const methodsHandler = new MethodsHandler();

/**
 * @swagger
 *
 * /methods:
 *   get:
 *     tags:
 *     - Methods
 *     description: Get list of all methods with parent resource
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Fetched listing of all methods
 *         schema:
 *           type: "array"
 *           items:
 *             $ref: "#/components/schemas/Methods"
 *       500:
 *         description: Unidentified error
 */
router.get('/',
    async (req: Request, res: Response) => {
        try {
            const response = await methodsHandler.getAll();
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
 * /methods/{methodId}:
 *   delete:
 *     tags:
 *     - Methods
 *     description: Delete of method by ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: methodId
 *         description: Id of method.
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: deleted method
 *       409:
 *         description: Invalid UUID provided
 *       500:
 *         description: Unidentified error
 */
router.delete('/:api',
    async (req: Request, res: Response) => {
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
            logger.logError({message: e.message, stack: e.stack, tag: "manager"});
        }
    });

/**
 * @swagger
 *
 * /methods:
 *   post:
 *     tags:
 *     - Methods
 *     description: Create or update a method
 *     requestBody:
 *       description: A method object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Methods"
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
            logger.logError({message: e.message, stack: e.stack, tag: "manager"});
        }
    });


/**
 * @swagger
 *
 * /methods/{methodId}:
 *   get:
 *     tags:
 *     - Methods
 *     description: Get a method details by id with parent resource
 *     parameters:
 *       - name: methodId
 *         description: Id of method.
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Get a method details
 *         schema:
 *           $ref: "#/components/schemas/Methods"
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
            logger.logError({message: e.message, stack: e.stack, tag: "manager"});
        }
    });

export const MethodsRouter: Router = router;
