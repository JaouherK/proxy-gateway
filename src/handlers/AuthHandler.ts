import {Request, Response} from "express";
import * as jwt from "jsonwebtoken";
import {User} from "../models/User";
import {config} from "../config/config";
import {JsonConsoleLogger} from "../logger/JsonConsoleLogger";
import {AuthenticationException} from "../exceptions/AuthenticationException";
import * as bcrypt from "bcryptjs";
import {token} from "morgan";
import {InputValidationException} from "../exceptions/InputValidationException";
import {HttpResponseCodes} from "../const/HttpResponseCodes";

export class AuthHandler {

    protected logger: JsonConsoleLogger;

    constructor(logger: JsonConsoleLogger) {
        this.logger = logger;
    }

    /**
     * Login users
     * @param  {Request} req
     * @param  {Response} res
     * @return {any}
     */
    public async login(req: Request, res: Response): Promise<any> {
        try {
            let {username, password} = req.body;
            if (!(username && password)) {
                throw new AuthenticationException('Missing fields');
            }
            let user: any;
            //Get users from database
            user = await User.findOne({where: {username}});

            if (!user) {
                throw new AuthenticationException('Unable to authenticate');
            }

            //Check if encrypted password match
            if (!this.checkIfUnencryptedPasswordIsValid(password, user.password)) {
                throw new AuthenticationException('Unable to authenticate');
            }

            //Sing JWT, valid for 1 hour
            const token = jwt.sign(
                {userId: user.id, username: user.username},
                config.jwtSecret,
                {expiresIn: "1h"}
            );

            res.setHeader("auth", token);
            res.send(token);

            this.logger.log({managing_route: req.url, payload: req.body, response: token, tag: "manager"});
        } catch (e) {
            if (e instanceof AuthenticationException) {
                res.status(HttpResponseCodes.Unauthorized).send({error: e.message});
            } else {
                res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
            }
            this.logger.logError({message: e, tag: "manager"});
        }
    }

    /**
     * Change current user password
     * @param  {Request} req
     * @param  {Response} res
     * @return {any}
     */
    public async changePassword(req: Request, res: Response): Promise<any> {
        try {
            //Get ID from JWT
            const id = res.locals.jwtPayload.userId;

            //Get parameters from the body
            const {oldPassword, newPassword} = req.body;
            if (!(oldPassword && newPassword)) {
                throw new InputValidationException('Missing fields');
            }

            //Get user from the database
            let user: any;
            user = await User.findByPk(id);

            if (!user) {
                throw new AuthenticationException('No provided user');
            }


            //Check if old password matches
            if (!this.checkIfUnencryptedPasswordIsValid(oldPassword, user.password)) {
                throw new AuthenticationException('Wrong password');
            }

            //Validate de model (password length)
            user.password = newPassword;
            const errors = this.validate(user.password);
            if (errors) {
                throw new AuthenticationException('Invalid password');
            }
            //Hash the new password and save
            user.password = this.hashPassword(user.password);

            const updatedUser = {
                id: id,
                password: user.password
            };
            await User.upsert(updatedUser);

            res.status(HttpResponseCodes.Ok).send({message: "Password updated"});

            this.logger.log({managing_route: req.url, payload: req.body, response: token, tag: "manager"});
        } catch (e) {
            if (e instanceof InputValidationException) {
                res.status(HttpResponseCodes.BadRequest).send({error: e.message});
            } else if (e instanceof AuthenticationException) {
                res.status(HttpResponseCodes.Unauthorized).send({error: e.message});
            } else {
                res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
            }
            this.logger.logError({message: e, tag: "manager"});
        }
    }

    /**
     * Get profile or sending HttpResponseCodes.Unauthorized
     * @param  {Request} req
     * @param  {Response} res
     * @return {any}
     */
    public async getProfile(req: Request, res: Response): Promise<any> {
        try {
            let user: any;
            if (!config.demoMode) {
                //Get ID from JWT
                const id = res.locals.jwtPayload.userId;

                //Get user from the database

                user = await User.findByPk(id);

                if (!user) {
                    throw new AuthenticationException('No provided user');
                }
            } else {
                user = {id: "4ac81092-c572-45f5-86c5-298e580cab04", username: "testUser", role: "ADMIN"};
            }
            res.send(user);

            this.logger.log({managing_route: req.url, payload: req.body, response: token, tag: "manager"});
        } catch (e) {
            if (e instanceof AuthenticationException) {
                res.status(HttpResponseCodes.Unauthorized).send({error: e.message});
            } else {
                res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
            }
            this.logger.logError({message: e, tag: "manager"});
        }
    }

    private checkIfUnencryptedPasswordIsValid(unencryptedPassword: string, encryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, encryptedPassword);
    }

    private validate(password: string) {
        if (password.length < 4) return false;
    }

    private hashPassword(password: string) {
        return bcrypt.hashSync(password, 8);
    }

}
