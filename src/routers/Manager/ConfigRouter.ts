import {Request, Response, Router} from 'express';
import {JsonConsoleLogger} from "../../logger/JsonConsoleLogger";
import {HttpResponseCodes} from "../../const/HttpResponseCodes";

const router: Router = Router();
const logger = new JsonConsoleLogger();

// restart the server in order to reconsider the new routes
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
                message: e
            });
            res.sendStatus(HttpResponseCodes.NotFound);
        }
    });

export const ConfigRouter: Router = router;
