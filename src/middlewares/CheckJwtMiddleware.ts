import {NextFunction, Request, Response} from "express";
import * as jwt from "jsonwebtoken";
import {config} from "../config/config";
import {JsonConsoleLogger} from "../logger/JsonConsoleLogger";
import {HttpResponseCodes} from "../const/HttpResponseCodes";

const logger = new JsonConsoleLogger();

export const checkJwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!config.demoMode) {
        //Get the jwt token from the head
        const token = <string>req.headers["auth"];
        let jwtPayload;

        //Try to validate the token and get data
        try {
            jwtPayload = <any>jwt.verify(token, config.jwtSecret);
            res.locals.jwtPayload = jwtPayload;
        } catch (error) {
            //If token is not valid, respond with 401 (unauthorized)
            res.status(HttpResponseCodes.Unauthorized).send();
            logger.logError({message: "JWT Token not verified for " + req.url, tag: "jwt"});
            return;
        }

        //The token is valid for 1 hour
        //We want to send a new token on every request
        const {userId, username} = jwtPayload;
        const newToken = jwt.sign({userId, username}, config.jwtSecret, {
            expiresIn: "1h"
        });
        res.setHeader("auth", newToken);
    }
    //Call the next middleware or controller
    next();
};
