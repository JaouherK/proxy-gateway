import {Request, Response} from 'express';
import {JsonConsoleLogger} from "../logger/JsonConsoleLogger";
import {Keys} from "../models/Keys";
import {KeysDomain} from "../domains/KeysDomain";
import {InputValidationException} from "../exceptions/InputValidationException";
import {NotFoundException} from "../exceptions/NotFoundException";
import validator from "validator";
import {Consumers} from "../models/Consumers";
import {HttpResponseCodes} from "../const/HttpResponseCodes";

export class KeysHandler {
    protected logger: JsonConsoleLogger;
    prefixLength = 5;

    constructor(logger: JsonConsoleLogger) {
        this.logger = logger;
    }

    /**
     * get all Keys
     * @param  {Request} req
     * @param  {Response} res
     * @return {any}
     */
    public async getAll(req: Request, res: Response): Promise<any> {
        try {
            const process = await Keys.findAll();
            const response: KeysDomain[] = [];
            process.forEach((value: any) => {
                const aux = new KeysDomain(
                    value.id,
                    value.keyHash,
                    value.keyPrefix,
                    value.name,
                    value.throttling,
                    value.throttlingRate,
                    value.throttlingBurst,
                    value.quota,
                    value.quotaRate,
                    value.quotaPeriod,
                    value.activeFrom,
                    value.activeTo,
                    value.active,
                    value.consumerId
                );
                response.push(aux);
            });
            res.send(response);

            this.logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
        } catch (e) {
            this.logger.logError({message: e.message, stack: e.stack, tag: "manager"});
            res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
        }
    }

    /**
     * delete an API Key
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
            Keys.destroy({where: {id}});
            const response = {delete: true};
            res.send(response);
            this.logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
        } catch (e) {
            if (e instanceof InputValidationException) {
                res.status(HttpResponseCodes.Conflict).send({error: e.message});
            } else {
                res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
            }
            this.logger.logError({message: e.message, stack: e.stack, tag: "manager"});
        }
    }

    /**
     * add/update an API Key
     * @param  {Request} req
     * @param  {Response} res
     * @return {any}
     */
    public async addOrUpdate(req: Request, res: Response): Promise<any> {
        try {

            const crypto = require('crypto');
            const payload = req.body;
            const apiData = req.body;

            if (!apiData.hasOwnProperty("id")) {
                const uuid = require('uuid-v4');
                apiData.id = uuid();
            }
            if (!validator.isUUID(apiData.id)) {
                throw new InputValidationException('Invalid ID: ' + req.url);
            }
            if (validator.isEmpty(apiData.name)) {
                throw new InputValidationException('Invalid namespace');
            }
            if (!(await this.existConsumer(apiData.consumerId))) {
                throw new NotFoundException('Invalid consumer ID: ' + req.url);
            }
            if ((apiData.keyPrefix === undefined) || (validator.isEmpty(apiData.keyPrefix))) {
                apiData.keyPrefix = this.makeid(this.prefixLength);
            }

            let apiKey: string;
            if (this.uniqueHash(apiData.keyHash)) {
                const uuid = require('uuid-v4');
                apiKey = uuid();
                apiData.keyHash = crypto.createHmac('sha256', apiData.keyPrefix)
                    .update(apiKey)
                    .digest('hex');
                apiKey = apiData.keyPrefix + '.' + apiKey;
            } else {
                throw new InputValidationException('Unable to create API key. Please restart.')
            }
            apiData.throttling = (apiData.throttling !== undefined) ? apiData.throttling : false;
            apiData.throttlingRate = (apiData.throttlingRate !== undefined) ? apiData.throttlingRate : 0;
            apiData.throttlingBurst = (apiData.throttlingBurst !== undefined) ? apiData.throttlingBurst : 0;
            apiData.quota = (apiData.quota !== undefined) ? apiData.quota : false;
            apiData.quotaRate = (apiData.quotaRate !== undefined) ? apiData.quotaRate : 0;
            apiData.quotaPeriod = (apiData.quotaPeriod !== undefined) ? apiData.quotaPeriod : 0;
            apiData.activeFrom = (apiData.activeFrom !== undefined) ? apiData.activeFrom : new Date();
            apiData.activePeriod = (apiData.activePeriod !== undefined) ? apiData.activePeriod : 10;
            const newDate = new Date().setFullYear(apiData.activeFrom.getFullYear() + apiData.activePeriod);
            apiData.activeTo = (apiData.activeTo !== undefined) ? apiData.activeTo : newDate;
            apiData.active = (apiData.active !== undefined) ? apiData.active : true;

            await Keys.upsert(apiData);
            const response = await Keys.findByPk(apiData.id);
            if (response === null) {
                throw new NotFoundException("API Key not found");
            } else {
                res.send({...response.toJSON(), ...{apiKey}});
                this.logger.log({managing_route: req.url, payload, response, tag: "manager"});
            }
        } catch (e) {
            if (e instanceof InputValidationException) {
                res.status(HttpResponseCodes.Conflict).send({error: e.message});
            } else if (e instanceof NotFoundException) {
                res.status(HttpResponseCodes.NotFound).send({error: e.message});
            } else {
                res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
            }
            this.logger.logError({message: e.message, stack: e.stack, tag: "manager"});
        }
    }

    /**
     * get API Key by ID
     * @param  {Request} req
     * @param  {Response} res
     * @param  {string} id  uuid v4 format
     * @return {any}
     */
    public async getById(req: Request, res: Response, id: string): Promise<any> {
        try {
            if (!validator.isUUID(id)) {
                throw new InputValidationException('Invalid ID: ' + req.url);
            }
            const value = await Keys.findByPk(id);
            if (value !== null) {
                const response = new KeysDomain(
                    value.id,
                    value.keyHash,
                    value.keyPrefix,
                    value.name,
                    value.throttling,
                    value.throttlingRate,
                    value.throttlingBurst,
                    value.quota,
                    value.quotaRate,
                    value.quotaPeriod,
                    value.activeFrom,
                    value.activeTo,
                    value.active,
                    value.consumerId
                );
                res.send(response);
                this.logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
            } else {
                throw new NotFoundException("API Key not found");
            }
        } catch (e) {
            if (e instanceof InputValidationException) {
                res.status(HttpResponseCodes.Conflict).send({error: e.message});
            } else if (e instanceof NotFoundException) {
                res.status(HttpResponseCodes.NotFound).send({error: e.message});
            } else {
                res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
            }
            this.logger.logError({message: e.message, stack: e.stack, tag: "manager"});
        }
    }

    /**
     * get all API Keys  by Consumer/owner ID
     * @param  {Request} req
     * @param  {Response} res
     * @param  {string} consumerId  uuid v4 format
     * @return {any}
     */
    public async getByConsumerId(req: Request, res: Response, consumerId: string): Promise<any> {
        try {
            if (!validator.isUUID(consumerId)) {
                throw new InputValidationException('Invalid ID: ' + req.url);
            }
            const process = await Keys.findAll({
                where: {
                    consumerId: consumerId
                }
            });
            if (process !== null) {
                const response: KeysDomain[] = [];
                process.forEach((value: any) => {
                    const aux = new KeysDomain(
                        value.id,
                        value.keyHash,
                        value.keyPrefix,
                        value.name,
                        value.throttling,
                        value.throttlingRate,
                        value.throttlingBurst,
                        value.quota,
                        value.quotaRate,
                        value.quotaPeriod,
                        value.activeFrom,
                        value.activeTo,
                        value.active,
                        value.consumerId
                    );
                    response.push(aux);
                });
                res.send(response);
                this.logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
            } else {
                throw new NotFoundException("API Key not found");
            }
        } catch (e) {
            if (e instanceof InputValidationException) {
                res.status(HttpResponseCodes.Conflict).send({error: e.message});
            } else if (e instanceof NotFoundException) {
                res.status(HttpResponseCodes.NotFound).send({error: e.message});
            } else {
                res.status(HttpResponseCodes.InternalServerError).send({error: e.message});
            }
            this.logger.logError({message: e.message, stack: e.stack, tag: "manager"});
        }
    }

    /**
     * create an ID
     * @access  private
     * @param  {number} length
     * @return {string}
     */
    private makeid(length: number): string {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    /**
     * check if a hash is unique
     * @access  private
     * @param  {string} hash
     * @return {string}
     */
    private async uniqueHash(hash: string): Promise<boolean> {
        const counter = await Keys.count({where: {'keyHash': hash}});
        return (counter === 0)
    }

    /**
     * check if a consumer exists
     * @access  private
     * @param  {string} consumerId
     * @return {boolean}
     */
    private async existConsumer(consumerId: string): Promise<boolean> {
        const counter = await Consumers.count({where: {'id': consumerId}});
        return (counter !== 0)
    }
}
