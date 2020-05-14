import {Request, Response, Router} from 'express';
import {JsonConsoleLogger} from "../../logger/JsonConsoleLogger";
import {KeysHandler} from "../../handlers/KeysHandler";

const router: Router = Router();
const logger = new JsonConsoleLogger();
const keyHandler = new KeysHandler(logger);

// get all API keys
router.get('/',
    async (req: Request, res: Response) => {
        await keyHandler.getAll(req, res);
    });

// delete a  API key by id
router.delete('/:api',

    async (req: Request, res: Response) => {
        const api = req.params.api;
        await keyHandler.deleteOne(req, res, api);
    });

// get a  API key by id
router.get('/:api',

    async (req: Request, res: Response) => {
        const api = req.params.api;
        await keyHandler.getById(req, res, api);
    });

// get a  API key by ConsumerId
router.get('/consumer/:api',

    async (req: Request, res: Response) => {
        const api = req.params.api;
        await keyHandler.getByConsumerId(req, res, api);
    });

// create or update  API keys
router.post('/',

    async (req: Request, res: Response) => {
        await keyHandler.addOrUpdate(req, res);
    });

export const ApiKeysRouter: Router = router;
