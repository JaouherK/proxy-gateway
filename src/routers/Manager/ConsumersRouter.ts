import {Request, Response, Router} from 'express';
import {JsonConsoleLogger} from "../../logger/JsonConsoleLogger";
import {ConsumersHandler} from "../../handlers/ConsumersHandler";
import {HttpResponseCodes} from "../../const/HttpResponseCodes";
import {InputValidationException} from "../../exceptions/InputValidationException";
import {NotFoundException} from "../../exceptions/NotFoundException";

const router: Router = Router();
const logger = new JsonConsoleLogger();
const consumerHandler = new ConsumersHandler();

// get all consumers
router.get('/',
    async (req: Request, res: Response) => {
        try {
            const response = await consumerHandler.getAll();
            res.send(response);
            logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
        } catch (e) {
            logger.logError({message: e, tag: "manager"});
            res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
        }
    });

// delete a consumer by id
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
            logger.logError({message: e, tag: "manager"});
        }
    });

// get a consumer by id
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
            logger.logError({message: e, tag: "manager"});
        }
    });

// create or update consumer
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
            logger.logError({message: e, tag: "manager"});
        }
    });

export const ConsumersRouter: Router = router;
