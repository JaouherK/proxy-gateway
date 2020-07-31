import {InputValidationException} from "../exceptions/InputValidationException";
import {NotFoundException} from "../exceptions/NotFoundException";
import validator from 'validator';
import {Strategies} from "../models/Strategies";
import {Features} from "../models/Features";

export class FeaturesHandler {

    /**
     * get all Features
     * @return {any}
     */
    public async getAll(): Promise<any> {
        return Features.findAll(
            {
                include: [
                    {
                        model: Strategies,
                        attributes: ['id', 'name', 'description'],
                        through: {attributes: ["parameters"]}
                    }
                ],
                attributes: ['id', 'name', 'description', 'enabled']
            }
        );
    }

    public async deleteOne(id: string, url: string): Promise<any> {
        if (!validator.isUUID(id)) {
            throw new InputValidationException('Invalid ID: ' + url);
        }
        return Features.destroy({where: {id}});
    }

    /**
     * add/update Feature
     * @return {any}
     * @param apiData
     * @param url
     */
    public async addOrUpdate(apiData: any, url: string): Promise<any> {

        const isUpdate = apiData.hasOwnProperty("id");

        if (apiData.name) {
            apiData.name = validator.whitelist(apiData.name, 'a-zA-Z0-9-_');
        }
        if (!isUpdate) {
            const uuid = require('uuid-v4');
            apiData.id = uuid();
        }

        if (!validator.isUUID(apiData.id)) {
            throw new InputValidationException('Invalid ID: ' + url);
        }

        // apiData.description = (apiData.description !== undefined) ? apiData.description : '';
        apiData.enabled = (apiData.enabled !== undefined) ? apiData.enabled : true;

        await Features.upsert(apiData);

        const response = await Features.findByPk(apiData.id);
        if (response === null) {
            throw new NotFoundException("An error occurred. Strategy not found");
        }

        return response;
    }

    /**
     * get feature by ID
     * @param  {string} id  uuid v4 format
     * @param  {string} url
     * @return {any}
     */
    public async getById(id: string, url: string): Promise<any> {
        if (!validator.isUUID(id)) {
            throw new InputValidationException('Invalid ID: ' + url);
        }
        const response = await Features.findByPk(id,
            {
                include: [
                    {
                        model: Strategies,
                        attributes: ['id', 'name', 'description'],
                        through: {attributes: ["parameters", "features_id", "strategies_id"]}
                    }
                ],
                attributes: ['id', 'name', 'description', 'enabled']
            }
        );
        if (response === null) {
            throw new NotFoundException("Strategy not found");
        }
        return response;
    }
}
