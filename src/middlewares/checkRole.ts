import {Request, Response, NextFunction} from "express";
import {User} from "../models/User";
import {config} from "../config/config";

export const checkRole = (roles: Array<string>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!config.demoMode) {
            //Get the user ID from previous middleware
            const id = res.locals.jwtPayload.userId;

            //Get user role from the database
            try {
                const user = await User.findByPk(id);
                //Check if array of authorized roles includes the user's role
                if (roles.indexOf(user!.role) > -1) next();
                else res.status(401).send();
            } catch (id) {
                res.status(401).send();
            }
        } else {
            next();
        }
    };
};
