import {Request, Response, Router} from 'express';
import {AuthHandler} from "../handlers/AuthHandler";
import {checkJwtMiddleware} from "../middlewares/CheckJwtMiddleware";
import {JsonConsoleLogger} from "../logger/JsonConsoleLogger";

const router: Router = Router();
const logger = new JsonConsoleLogger();
const authHandler = new AuthHandler(logger);

//Login route
router.post("/login", async (req: Request, res: Response) => {
    await authHandler.login(req, res);
});

//Change my password
router.post("/change-password",
    [checkJwtMiddleware],
    async (req: Request, res: Response) => {
        await authHandler.changePassword(req, res);
    });

//Change my password
router.get("/profile",
    [checkJwtMiddleware],
    async (req: Request, res: Response) => {
        await authHandler.getProfile(req, res);
    });

export const AuthenticationRouter: Router = router;
