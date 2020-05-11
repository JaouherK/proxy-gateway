import {NextFunction, Request, Response} from "express";

export const emptyMiddleware = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        return next();
    };
};
