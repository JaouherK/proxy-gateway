import {Request, Response} from "express";
import {User} from "../models/User";
import {NotFoundException} from "../exceptions/NotFoundException";
import {JsonConsoleLogger} from "../logger/JsonConsoleLogger";
import validator from "validator";
import {InputValidationException} from "../exceptions/InputValidationException";
import {AuthenticationException} from "../exceptions/AuthenticationException";
import * as bcrypt from "bcryptjs";
import {HttpResponseCodes} from "../const/HttpResponseCodes";

export class UserHandler {

    protected logger: JsonConsoleLogger;

    constructor(logger: JsonConsoleLogger) {
        this.logger = logger;
    }

    /**
     * get all resources
     * @param  {Request} req
     * @param  {Response} res
     * @return {any}
     */
    public async getAll(req: Request, res: Response): Promise<any> {
        try {
            //Get users from database
            const users = await User.findAll(
                {
                    attributes: ["id", "username", "role"]
                });

            //Send the users object
            res.send(users);

            this.logger.log({managing_route: req.url, payload: req.body, response: users, tag: "manager"});
        } catch (e) {
            this.logger.logError({message: e, tag: "manager"});
            res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
        }
    }


    /**
     * get a user by ID
     * @param  {Request} req
     * @param  {Response} res
     * @param  {string} id uuid v4 format
     * @return {any}
     */
    public async getById(req: Request, res: Response, id: string): Promise<any> {
        try {
            if (!validator.isUUID(id)) {
                throw new InputValidationException('Invalid ID');
            }
            const response = await User.findByPk(id, {
                attributes: ["id", "username", "role"]
            });

            if (response !== null) {

                res.send(response);

                this.logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
            } else {
                throw new NotFoundException("Resource not found");
            }
        } catch (e) {
            if (e instanceof InputValidationException) {
                res.status(HttpResponseCodes.Conflict).send({error: e.message});
            } else if (e instanceof NotFoundException) {
                res.status(HttpResponseCodes.NotFound).send({error: e.message});
            } else {
                res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
            }
            this.logger.logError({message: e, tag: "manager"});
        }
    }

    /**
     * add/update user
     * @param  {Request} req
     * @param  {Response} res
     * @return {any}
     */
    public async createUser(req: Request, res: Response): Promise<any> {
        try {

            let {username, password, role} = req.body;
            let user: any = {};
            user.username = username;
            user.password = password;
            user.role = role;
            const uuid = require('uuid-v4');
            user.id = uuid();

            if (!(await this.uniqueUsername(username))) {
                throw new InputValidationException('Username already in use.');
            }

            const errors = this.validate(user.password);
            if (errors) {
                throw new AuthenticationException('Invalid password');
            }
            //Hash the new password and save
            user.password = this.hashPassword(user.password);

            await User.upsert(user);

            res.status(HttpResponseCodes.Created).send(user);
            this.logger.log({managing_route: req.url, payload: req.body, response: user, tag: "manager"});

        } catch (e) {
            if (e instanceof InputValidationException) {
                res.status(HttpResponseCodes.Conflict).send({error: e.message});
            } else if (e instanceof NotFoundException) {
                res.status(HttpResponseCodes.NotFound).send({error: e.message});
            } else {
                res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
            }
            this.logger.logError({message: e, tag: "manager"});
        }
    }


    /**
     * add/update user
     * @param  {Request} req
     * @param  {Response} res
     * @param id
     * @return {any}
     */
    public async editUser(req: Request, res: Response, id: string): Promise<any> {
        try {
            if (!validator.isUUID(id)) {
                throw new InputValidationException('Invalid ID');
            }
            //Get values from the body
            const {username, role} = req.body;
            let user;
            user = await User.findByPk(id);

            if (!user) {
                throw new NotFoundException('User not found')
            }
            //Validate the new values on model
            user.username = username;
            user.role = role;

            if (!(await this.uniqueUsername(username))) {
                throw new InputValidationException('Username already in use.');
            }

            //Try to safe, if fails, that means username already in use
            await User.upsert(user);

            res.status(HttpResponseCodes.Created).send(user);
            this.logger.log({managing_route: req.url, payload: req.body, response: user, tag: "manager"});

        } catch (e) {
            if (e instanceof InputValidationException) {
                res.status(HttpResponseCodes.Conflict).send({error: e.message});
            } else if (e instanceof NotFoundException) {
                res.status(HttpResponseCodes.NotFound).send({error: e.message});
            } else {
                res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
            }
            this.logger.logError({message: e, tag: "manager"});
        }
    }

    /**
     * delete a user
     * @param  {Request} req
     * @param  {Response} res
     * @param  {string} id uuid v4 format
     * @return {any}
     */
    public async deleteOne(req: Request, res: Response, id: string): Promise<any> {
        try {
            if (!validator.isUUID(id)) {
                throw new InputValidationException('Invalid ID: ' + req.url);
            }
            await User.destroy({where: {id}});
            const response = {delete: true};
            res.status(HttpResponseCodes.NoContent).send(response);
            this.logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
        } catch (e) {
            if (e instanceof InputValidationException) {
                res.status(HttpResponseCodes.Conflict).send({error: e.message});
            } else {
                res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
            }
            this.logger.logError({message: e, tag: "manager"});
        }
    }

    /**
     * check uniqueness of username
     * @return {any}
     * @param username
     */
    private async uniqueUsername(username: string): Promise<boolean> {
        const counter = await User.count({where: {'username': username}});
        return (counter === 0)
    }

    private validate(password: string) {
        if (password.length < 4) return false
    }

    private hashPassword(password: string) {
        return bcrypt.hashSync(password, 8);
    }
}

