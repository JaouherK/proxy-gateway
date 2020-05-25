import {Request, Response, Router} from 'express';
import {JsonConsoleLogger} from "../../logger/JsonConsoleLogger";
import {ConsumersHandler} from "../../handlers/ConsumersHandler";
import {HttpResponseCodes} from "../../const/HttpResponseCodes";
import {InputValidationException} from "../../exceptions/InputValidationException";
import {NotFoundException} from "../../exceptions/NotFoundException";

const router: Router = Router();
const logger = new JsonConsoleLogger();
const consumerHandler = new ConsumersHandler();

/**
 * @swagger
 *
 * /consumers:
 *   get:
 *     tags:
 *     - Consumers
 *     description: Get list of all consumers
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Fetched listing of all consumers
 *         schema:
 *           type: "array"
 *           items:
 *             $ref: "#/components/schemas/Consumers"
 *       500:
 *         description: Unidentified error
 */
router.get('/',
    async (req: Request, res: Response) => {
        try {
            const response = await consumerHandler.getAll();
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
 * /consumers/{consumerId}:
 *   delete:
 *     tags:
 *     - Consumers
 *     description: Delete of consumer by ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: consumerId
 *         description: Id of user.
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
            const response = await consumerHandler.deleteOne(req.url, api);
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
 * /consumers/{consumerId}:
 *   get:
 *     tags:
 *     - Consumers
 *     description: Get a consumer details by id
 *     parameters:
 *       - name: consumerId
 *         description: Id of consumer.
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Get a method details
 *         schema:
 *           $ref: "#/components/schemas/Consumers"
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
            logger.logError({message: e.message, stack: e.stack, tag: "manager"});
        }
    });

/**
 * @swagger
 *
 * /consumers:
 *   post:
 *     tags:
 *     - Consumers
 *     description: Create or update a consumer
 *     requestBody:
 *       description: A consumer object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Consumers"
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
            logger.logError({message: e.message, stack: e.stack, tag: "manager"});
        }
    });

export const ConsumersRouter: Router = router;
