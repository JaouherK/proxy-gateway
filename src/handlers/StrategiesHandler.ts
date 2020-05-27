import {InputValidationException} from "../exceptions/InputValidationException";
import {NotFoundException} from "../exceptions/NotFoundException";
import validator from 'validator';
import {Strategies} from "../models/Strategies";
import {Features} from "../models/Features";


export class StrategiesHandler {

    /**
     * get all Strategies
     * @return {any}
     */
    public async getAll(): Promise<any> {
        return Strategies.findAll();
    }

    public async deleteOne(id: string, url: string): Promise<any> {
        if (!validator.isUUID(id)) {
            throw new InputValidationException('Invalid ID: ' + url);
        }
        return Strategies.destroy({where: {id}});
    }

    /**
     * add/update strategy
     * @return {any}
     * @param apiData
     * @param url
     */
    public async addOrUpdate(apiData: any, url: string): Promise<any> {

        const isUpdate = apiData.hasOwnProperty("id");

        apiData.name = validator.whitelist(apiData.name, 'a-zA-Z0-9-_');
        if (!isUpdate) {
            const uuid = require('uuid-v4');
            apiData.id = uuid();
        }

        if (!validator.isUUID(apiData.id)) {
            throw new InputValidationException('Invalid ID: ' + url);
        }
        apiData.parameters = (apiData.parameters !== undefined) ? JSON.stringify(apiData.parameters) : '{}';
        await Strategies.upsert(apiData);

        const response = await Strategies.findByPk(apiData.id);
        if (response === null) {
            throw new NotFoundException("An error occurred. Strategy not found");
        }

        return response;
    }

    /**
     * get strategy by ID
     * @param  {string} id  uuid v4 format
     * @param  {string} url
     * @return {any}
     */
    public async getById(id: string, url: string): Promise<any> {
        if (!validator.isUUID(id)) {
            throw new InputValidationException('Invalid ID: ' + url);
        }
        const response = await Strategies.findByPk(id, {
            include: [Features]
        });
        if (response === null) {
            throw new NotFoundException("Strategy not found");
        }
        return response;
    }
}
