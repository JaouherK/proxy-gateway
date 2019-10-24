import {Proxies} from "../models/Proxies";
import {InputValidationException} from "../exceptions/InputValidationException";
import validator from "validator";

export class ProxyHandler {

    /**
     * get all proxies
     * @return {any}
     */
    public async getAll(): Promise<any> {
        return await Proxies.findAll({
            order: [
                ['namespace', 'DESC'],
                ['order', 'DESC']
            ],
        });
    }

    /**
     * get all proxies by namespace
     * @param  {string} id
     * @return {any}
     */
    public async getAllByNamespace(id: string): Promise<any> {
        if (!validator.isUUID(id)) {
            throw new InputValidationException('Invalid ID');
        }
        return await Proxies.findAll({
            where: {namespacesId: id},
            order: [
                ['order', 'DESC']
            ],
        });
    }

    /**
     * save proxies provided
     * @return {any}
     * @param apiData
     */
    public async saveRoutes(apiData: any): Promise<any> {

        await Proxies.destroy({
            where: {
                namespacesId: apiData[0].namespacesId
            },
        });

        apiData.forEach((element: any) => {
            Proxies.upsert(element);
        });

        return {save: true};

    }

    /**
     * delete a proxy
     * @param  {string} id uuid v4 format
     * @return {any}
     */
    public async deleteOne(id: string): Promise<any> {
        if (!validator.isUUID(id)) {
            throw new InputValidationException('Invalid ID');
        }
        await Proxies.destroy({where: {id}});
        return {delete: true};
    }

    /**
     * check if proxy exist by ID
     * @param  {string} id  uuid v4 format
     * @return {any}
     */
    public async existById(id: string): Promise<any> {
        if (!validator.isUUID(id)) {
            throw new InputValidationException('Invalid ID');
        }
        const response = await Proxies.findByPk(id);
        let exist = {exist: false};
        if (response !== null) {
            exist = {exist: true}
        }

        return exist;
    }
}
