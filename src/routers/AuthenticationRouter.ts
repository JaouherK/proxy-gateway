import {Response, Router, Request} from 'express';
import {AuthHandler} from "../handlers/AuthHandler";
import {checkJwt} from "../middlewares/checkJwt";
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
    [checkJwt],
    async (req: Request, res: Response) => {
        await authHandler.changePassword(req, res);
    });

export const AuthenticationRouter: Router = router;