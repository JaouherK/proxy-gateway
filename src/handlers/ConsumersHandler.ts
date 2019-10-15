import {Response, Request} from 'express';
import {JsonConsoleLogger} from "../logger/JsonConsoleLogger";
import {Consumers} from "../models/Consumers";
import {InputValidationException} from "../exceptions/InputValidationException";
import {NotFoundException} from "../exceptions/NotFoundException";
import validator from "validator";

export class ConsumersHandler {
    protected logger: JsonConsoleLogger;

    constructor(logger: JsonConsoleLogger) {
        this.logger = logger;
    }

    public async getAll(req: Request, res: Response): Promise<any> {
        try {
            const response = await Consumers.findAll();

            res.send(response);

            this.logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
        } catch (e) {
            this.logger.logError({message: e, tag: "manager"});
            res.status(500).send({error: e.message});
        }
    }

    public async deleteOne(req: Request, res: Response, id: string): Promise<any> {
        try {
            if (!validator.isUUID(id)) {
                throw new InputValidationException('Invalid ID: ' + req.url);
            }
            Consumers.destroy({where: {id}});
            const response = {delete: true};
            res.send(response);
            this.logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
        } catch (e) {
            if (e instanceof InputValidationException) {
                res.status(409).send({error: e.message});
            } else {
                res.status(500).send({error: e.message});
            }
            this.logger.logError({message: e, tag: "manager"});
        }
    }

    public async addOrUpdate(req: Request, res: Response): Promise<any> {
        try {

            const payload = req.body;
            const apiData = req.body;

            if (!apiData.hasOwnProperty("id")) {
                if (!(await this.uniqueUsername(apiData.username))) {
                    throw new InputValidationException('Username already exists');
                }
                const uuid = require('uuid-v4');
                apiData.id = uuid();
            }
            if (!validator.isUUID(apiData.id)) {
                throw new InputValidationException('Invalid ID: ' + req.url);
            }
            if (validator.isEmpty(apiData.username)) {
                throw new InputValidationException('Invalid namespace');
            }
            apiData.email = (apiData.email !== undefined) ? apiData.email : '';
            apiData.customId = (apiData.customId !== undefined) ? apiData.customId : '';
            apiData.active = (apiData.active !== undefined) ? apiData.active : true;

            await Consumers.upsert(apiData);
            const response = await Consumers.findByPk(apiData.id);
            if (response === null) {
                throw new NotFoundException("Consumers not found");
            } else {
                res.send(response);
                this.logger.log({managing_route: req.url, payload, response, tag: "manager"});
            }
        } catch (e) {
            if (e instanceof InputValidationException) {
                res.status(409).send({error: e.message});
            } else if (e instanceof NotFoundException) {
                res.status(404).send({error: e.message});
            } else {
                res.status(500).send({error: e.message});
            }
            this.logger.logError({message: e, tag: "manager"});
        }
    }

    public async getById(req: Request, res: Response, id: string): Promise<any> {
        try {
            if (!validator.isUUID(id)) {
                throw new InputValidationException('Invalid ID: ' + req.url);
            }
            const response = await Consumers.findByPk(id);
            if (response !== null) {
                res.send(response);
                this.logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
            } else {
                throw new NotFoundException("Consumer not found");
            }
        } catch (e) {
            if (e instanceof InputValidationException) {
                res.status(409).send({error: e.message});
            } else if (e instanceof NotFoundException) {
                res.status(404).send({error: e.message});
            } else {
                res.status(500).send({error: e.message});
            }
            this.logger.logError({message: e, tag: "manager"});
        }
    }

    private async uniqueUsername(username: string): Promise<boolean> {
        const counter = await Consumers.count({where: {'username': username}});
        return (counter === 0)
    }
}
