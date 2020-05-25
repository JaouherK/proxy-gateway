import {Request, Response, Router} from 'express';
import {JsonConsoleLogger} from "../../logger/JsonConsoleLogger";
import {HttpResponseCodes} from "../../const/HttpResponseCodes";

const router: Router = Router();
const logger = new JsonConsoleLogger();

/**
 * @swagger
 *
 * /config/restart:
 *   get:
 *     tags:
 *     - Config
 *     description: restart the server in order to reconsider the new routes
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Restart successful
 *       500:
 *         description: Unidentified error
 */
router.get('/restart',
    async (req: Request, res: Response) => {
        try {
            logger.logSecurity({
                managing_route: req.url,
                payload: req.body,
                process: '♥ FailSafe reloading routes',
                tag: 'manager'
            });
            res.status(HttpResponseCodes.Ok).send({status: HttpResponseCodes.Ok});
            process.kill(process.pid);
        } catch (e) {
            logger.logError({
                message: e.message,
                stack: e.stack,
            });
            res.sendStatus(HttpResponseCodes.InternalServerError);
        }
    });

export const ConfigRouter: Router = router;
