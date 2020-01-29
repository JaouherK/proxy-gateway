import {Request} from 'express';
import {Consumers} from "../models/Consumers";
import {InputValidationException} from "../exceptions/InputValidationException";
import {NotFoundException} from "../exceptions/NotFoundException";
import validator from "validator";

export class ConsumersHandler {

    /**
     * get all consumers/owners/users
     * @return {any}
     */
    public async getAll(): Promise<any> {
        return await Consumers.findAll();
    }

    /**
     * delete a consumer/owner/user by id
     * @param url
     * @param  {string} id uuid v4 format
     * @return {any}
     */
    public async deleteOne(url: string, id: string): Promise<any> {
        if (!validator.isUUID(id)) {
            throw new InputValidationException('Invalid ID: ' + url);
        }
        Consumers.destroy({where: {id}});
        return {delete: true};
    }

    /**
     * add/update consumer/owner/user
     * @param  {Request} req
     * @return {any}
     */
    public async addOrUpdate(req: Request): Promise<any> {

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
            return response;
        }

    }

    /**
     * get consumer/owner/user by ID
     * @param url
     * @param  {string} id  uuid v4 format
     * @return {any}
     */
    public async getById(url: string, id: string): Promise<any> {
        if (!validator.isUUID(id)) {
            throw new InputValidationException('Invalid ID: ' + url);
        }
        const response = await Consumers.findByPk(id);
        if (response !== null) {
            return response;
        } else {
            throw new NotFoundException("Consumer not found");
        }

    }

    /**
     * check uniqueness of a username
     * @access  private
     * @param  {string} username
     * @return {boolean}
     */
    private async uniqueUsername(username: string): Promise<boolean> {
        const counter = await Consumers.count({where: {'username': username}});
        return (counter === 0);
    }
}
