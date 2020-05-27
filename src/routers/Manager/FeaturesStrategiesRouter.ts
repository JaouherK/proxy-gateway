import {Request, Response, Router} from 'express';
import {JsonConsoleLogger} from "../../logger/JsonConsoleLogger";
import {InputValidationException} from "../../exceptions/InputValidationException";
import {NotFoundException} from "../../exceptions/NotFoundException";
import {HttpResponseCodes} from "../../const/HttpResponseCodes";
import {FeaturesStrategiesHandler} from "../../handlers/FeaturesStrategiesHandler";

const router: Router = Router();
const logger = new JsonConsoleLogger();
const handler = new FeaturesStrategiesHandler();

/**
 * @swagger
 *
 * /feature-strategy/assign:
 *   post:
 *     tags:
 *     - Features
 *     description: Create or update feature - strategy association
 *     requestBody:
 *       description: A feature - strategy association object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/FeaturesStrategies"
 *     responses:
 *       200:
 *         description: valid response
 *       409:
 *         description: Invalid UUID provided
 *       500:
 *         description: unidentified error
 */
router.post('/assign',
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
 * /feature-strategy/break/{featureId}/{strategyId}:
 *   delete:
 *     tags:
 *     - Features
 *     description: Delete feature-strategy association
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: featureId
 *         description: Id of feature.
 *         in: path
 *         required: true
 *         type: string
 *       - name: strategyId
 *         description: Id of strategy.
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: deleted feature-strategy association
 *       409:
 *         description: Invalid UUID provided
 */
router.delete('/break/:featureId/:strategyId',
    async (req: Request, res: Response) => {
        try {
            const featureId = req.params.featureId;
            const strategyId = req.params.strategyId;
            await handler.deleteOne(featureId, strategyId);
            const response = {delete: true};
            res.send(response);
            logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
        } catch (e) {
            logger.logError({message: e.message, stack: e.stack, tag: "manager"});
            res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
        }
    });


/***************************************************************************************/

export const FeaturesStrategiesRouter: Router = router;
