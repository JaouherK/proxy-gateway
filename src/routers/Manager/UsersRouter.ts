import {Request, Response, Router} from 'express';
import {JsonConsoleLogger} from "../../logger/JsonConsoleLogger";
import {UserHandler} from "../../handlers/UserHandler";

const router: Router = Router();
const logger = new JsonConsoleLogger();
const userHandler = new UserHandler(logger);

//Get all users
router.get("/",
    async (req: Request, res: Response) => {
        await userHandler.getAll(req, res);
    });

// Get one user
router.get(
    "/:id",
    async (req: Request, res: Response) => {
        const id = req.params.id;
        await userHandler.getById(req, res, id);
    }
);

//Create a new user
router.post("/",
    async (req: Request, res: Response) => {
        await userHandler.createUser(req, res);
    });

//Edit one user
router.patch(
    "/:id",
    async (req: Request, res: Response) => {
        const id = req.params.id;
        await userHandler.editUser(req, res, id);
    }
);

//Delete one user
router.delete(
    "/:id",
    async (req: Request, res: Response) => {
        const id = req.params.id;
        await userHandler.deleteOne(req, res, id);
    }
);

/***************************************************************************************/

export const UsersRouter: Router = router;
