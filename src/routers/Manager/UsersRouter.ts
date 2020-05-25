import {Request, Response, Router} from 'express';
import {JsonConsoleLogger} from "../../logger/JsonConsoleLogger";
import {UserHandler} from "../../handlers/UserHandler";

const router: Router = Router();
const logger = new JsonConsoleLogger();
const userHandler = new UserHandler(logger);

/**
 * @swagger
 *
 * /users:
 *   get:
 *     tags:
 *     - Users
 *     description: Get list of all users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Fetched listing of all users
 *         schema:
 *           type: "array"
 *           items:
 *             $ref: "#/components/schemas/Users"
 *       500:
 *         description: Unidentified error
 */
router.get("/",
    async (req: Request, res: Response) => {
        await userHandler.getAll(req, res);
    });

/**
 * @swagger
 *
 * /users/{userId}:
 *   get:
 *     tags:
 *     - Users
 *     description: Get a user details by id
 *     parameters:
 *       - name: userId
 *         description: Id of user.
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Get a user details
 *         schema:
 *           $ref: "#/components/schemas/Users"
 *       409:
 *         description: Invalid UUID provided
 *       404:
 *         description: UUID does not exist
 *       500:
 *         description: unidentified error
 */
router.get(
    "/:id",
    async (req: Request, res: Response) => {
        const id = req.params.id;
        await userHandler.getById(req, res, id);
    }
);

/**
 * @swagger
 *
 * /users:
 *   post:
 *     tags:
 *     - Users
 *     description: Create a user
 *     requestBody:
 *       description: A user object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Users"
 *     responses:
 *       200:
 *         description: Valid response
 *       409:
 *         description: Invalid UUID provided
 *       500:
 *         description: Unidentified error
 */
router.post("/",
    async (req: Request, res: Response) => {
        await userHandler.createUser(req, res);
    });

/**
 * @swagger
 *
 * /users/{userId}:
 *   put:
 *     tags:
 *     - Users
 *     description: Edit a user
 *     parameters:
 *       - name: userId
 *         description: Id of user.
 *         in: path
 *         required: true
 *         type: string
 *     requestBody:
 *       description: A user object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Users"
 *     responses:
 *       201:
 *         description: Successful creation
 *       409:
 *         description: Conflict while creating user
 *       500:
 *         description: Unidentified error
 */
router.put(
    "/:id",
    async (req: Request, res: Response) => {
        const id = req.params.id;
        await userHandler.editUser(req, res, id);
    }
);

/**
 * @swagger
 *
 * /users/{userId}:
 *   delete:
 *     tags:
 *     - Users
 *     description: Delete of user by ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
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
router.delete(
    "/:id",
    async (req: Request, res: Response) => {
        const id = req.params.id;
        await userHandler.deleteOne(req, res, id);
    }
);

/***************************************************************************************/

export const UsersRouter: Router = router;
