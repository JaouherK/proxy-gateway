import {Request, Response, Router} from 'express';
import {JsonConsoleLogger} from "../../logger/JsonConsoleLogger";
import {InputValidationException} from "../../exceptions/InputValidationException";
import {NotFoundException} from "../../exceptions/NotFoundException";
import {HttpResponseCodes} from "../../const/HttpResponseCodes";
import {FeaturesHandler} from "../../handlers/FeaturesHandler";

const router: Router = Router();
const logger = new JsonConsoleLogger();
const handler = new FeaturesHandler();

/**
 * @swagger
 *
 * /features:
 *   get:
 *     tags:
 *     - Features
 *     description: Get list of all Features
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Fetched listing of all features
 *         schema:
 *           type: "array"
 *           items:
 *             $ref: "#/components/schemas/Features"
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
 * /features:
 *   post:
 *     tags:
 *     - Features
 *     description: Create or update feature
 *     requestBody:
 *       description: A feature object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Features"
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
 * /features/{featureId}:
 *   delete:
 *     tags:
 *     - Features
 *     description: Delete feature by ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: featureId
 *         description: Id of feature.
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: deleted feature
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
 * /features/{featureId}:
 *   get:
 *     tags:
 *     - Features
 *     description: Get a feature by id
 *     parameters:
 *       - name: featureId
 *         description: Id of feature.
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Get a strategy details
 *         schema:
 *           $ref: "#/components/schemas/Features"
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

export const FeaturesRouter: Router = router;
