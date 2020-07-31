import {Request, Response, Router} from 'express';
import {JsonConsoleLogger} from "../../logger/JsonConsoleLogger";
import {HttpResponseCodes} from "../../const/HttpResponseCodes";
import {StrategyOptionsHandler} from "../../handlers/StrategyOptionsHandler";

const router: Router = Router();
const logger = new JsonConsoleLogger();
const handler = new StrategyOptionsHandler();


/**
 * @swagger
 *
 * /strategy-options/{optionId}:
 *   delete:
 *     tags:
 *     - Strategy-options
 *     description: Delete strategy option
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: optionId
 *         description: Id of option.
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: deleted feature-strategy association
 *       409:
 *         description: Invalid UUID provided
 */
router.delete('/:optionId',
    async (req: Request, res: Response) => {
        try {
            const optionId = req.params.optionId;
            await handler.deleteOne(optionId);
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
