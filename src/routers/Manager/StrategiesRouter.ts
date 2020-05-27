import {Request, Response, Router} from 'express';
import {JsonConsoleLogger} from "../../logger/JsonConsoleLogger";
import {InputValidationException} from "../../exceptions/InputValidationException";
import {NotFoundException} from "../../exceptions/NotFoundException";
import {HttpResponseCodes} from "../../const/HttpResponseCodes";
import {StrategiesHandler} from "../../handlers/StrategiesHandler";

const router: Router = Router();
const logger = new JsonConsoleLogger();
const handler = new StrategiesHandler();

/**
 * @swagger
 *
 * /strategies:
 *   get:
 *     tags:
 *     - Strategies
 *     description: Get list of all strategies
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Fetched listing of all strategies
 *         schema:
 *           type: "array"
 *           items:
 *             $ref: "#/components/schemas/Strategies"
 *       500:
 *         description: unidentified error
 */
router.get('/',
    async (req: Request, res: Response) => {
        try {
            const response = await handler.getAll();
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
 * /strategies:
 *   post:
 *     tags:
 *     - Strategies
 *     description: Create or update strategy
 *     requestBody:
 *       description: A strategy object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Strategies"
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
            const response = await handler.addOrUpdate(req.body, req.url);
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
 * /strategies/{strategyId}:
 *   delete:
 *     tags:
 *     - Strategies
 *     description: Delete strategy by ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: strategyId
 *         description: Id of strategy.
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: deleted strategy
 *       409:
 *         description: Invalid UUID provided
 */
router.delete('/:api',
    async (req: Request, res: Response) => {
        try {
            const api = req.params.api;
            await handler.deleteOne(api, req.url);
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
 * /strategies/{strategyId}:
 *   get:
 *     tags:
 *     - Strategies
 *     description: Get a strategy by id
 *     parameters:
 *       - name: strategyId
 *         description: Id of strategy.
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Get a strategy details
 *         schema:
 *           $ref: "#/components/schemas/Strategies"
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
            const response = await handler.getById(api, req.url);

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

/***************************************************************************************/

export const StrategiesRouter: Router = router;
