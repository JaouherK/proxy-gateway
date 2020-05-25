import {Request, Response, Router} from 'express';
import {JsonConsoleLogger} from "../../logger/JsonConsoleLogger";
import {KeysHandler} from "../../handlers/KeysHandler";

const router: Router = Router();
const logger = new JsonConsoleLogger();
const keyHandler = new KeysHandler(logger);

/**
 * @swagger
 *
 * /keys:
 *   get:
 *     tags:
 *     - API Keys
 *     description: Get list of all api keys
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Fetched listing of all api keys
 *         schema:
 *           type: "array"
 *           items:
 *             $ref: "#/components/schemas/Keys"
 *       500:
 *         description: Unidentified error
 */
router.get('/',
    async (req: Request, res: Response) => {
        await keyHandler.getAll(req, res);
    });

/**
 * @swagger
 *
 * /keys/{keyId}:
 *   delete:
 *     tags:
 *     - API Keys
 *     description: Delete of API key by ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: keyId
 *         description: Id of API key.
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
        const api = req.params.api;
        await keyHandler.deleteOne(req, res, api);
    });

/**
 * @swagger
 *
 * /keys/{keyId}:
 *   get:
 *     tags:
 *     - API Keys
 *     description: Get API key details by id
 *     parameters:
 *       - name: keyId
 *         description: Id of API key.
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Get a method details
 *         schema:
 *           $ref: "#/components/schemas/Keys"
 *       409:
 *         description: Invalid UUID provided
 *       404:
 *         description: UUID does not exist
 *       500:
 *         description: unidentified error
 */
router.get('/:api',

    async (req: Request, res: Response) => {
        const api = req.params.api;
        await keyHandler.getById(req, res, api);
    });

/**
 * @swagger
 *
 * /keys/consumer/{consumerId}:
 *   get:
 *     tags:
 *     - API Keys
 *     description: Get a API Keys list by consumer id
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
 *         description: Get API Keys list by consumer id
 *         schema:
 *           $ref: "#/components/schemas/Keys"
 *       409:
 *         description: Invalid UUID provided
 *       404:
 *         description: UUID does not exist
 *       500:
 *         description: unidentified error
 */
router.get('/consumer/:api',

    async (req: Request, res: Response) => {
        const api = req.params.api;
        await keyHandler.getByConsumerId(req, res, api);
    });

/**
 * @swagger
 *
 * /keys:
 *   post:
 *     tags:
 *     - API Keys
 *     description: Create or update an API Key
 *     requestBody:
 *       description: An API Key object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Keys"
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
        await keyHandler.addOrUpdate(req, res);
    });

export const ApiKeysRouter: Router = router;
