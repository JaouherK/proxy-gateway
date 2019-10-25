import {Proxies} from "../models/Proxies";
import {InputValidationException} from "../exceptions/InputValidationException";
import validator from "validator";
import {JsonConsoleLogger} from "../logger/JsonConsoleLogger";
import {ProxyDomain} from "../domains/ProxyDomain";
import {Namespaces} from "../models/Namespaces";
import {Resources} from "../models/Resources";
import {Methods} from "../models/Methods";
import {Consumers} from "../models/Consumers";
import {Keys} from "../models/Keys";
import {User} from "../models/User";
import {sequelize} from "../sequelize";

export class ProxyHandler {

    constructor() {
        sequelize.addModels([Proxies]);

    }

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

    public static async getAllProxyMappings(logger: JsonConsoleLogger): Promise<ProxyDomain[]> {
        await Proxies.sync();
        const arr: ProxyDomain[] = [];
        try {
            const process = await Proxies.findAll({
                order: [
                    ['order', 'DESC']
                ],
            });

            process.forEach((value: any) => {
                const aux = new ProxyDomain(
                    value.id,
                    value.namespacesId,
                    value.namespace,
                    value.url,
                    value.endpointUrl,
                    value.https,
                    value.method,
                    value.denyUpload,
                    value.limit,
                    value.authType,
                    value.timeout,
                    value.integrationType,
                    value.mockResponseBody,
                    value.mockResponseCode,
                    value.mockResponseContent,
                    value.order
                );
                arr.push(aux);
            });
            logger.log({message: 'proxies sync success ', tag: 'sync'});
        } catch (e) {
            logger.logError({message: e, tag: "sync"});
        }

        Namespaces.sync()
            .then(() => logger.log({message: 'namespaces sync success ', tag: 'sync'}))
            .error((e) => logger.logError({message: e, tag: "sync"}));
        Resources.sync()
            .then(() => logger.log({message: 'resources sync success ', tag: 'sync'}))
            .error((e) => logger.logError({message: e, tag: "sync"}));
        Methods.sync()
            .then(() => logger.log({message: 'methods sync success ', tag: 'sync'}))
            .error((e) => logger.logError({message: e, tag: "sync"}));
        Consumers.sync()
            .then(() => logger.log({message: 'consumers sync success ', tag: 'sync'}))
            .error((e) => logger.logError({message: e, tag: "sync"}));
        Keys.sync()
            .then(() => logger.log({message: 'keys sync success ', tag: 'sync'}))
            .error((e) => logger.logError({message: e, tag: "sync"}));
        User.sync()
            .then(() => logger.log({message: 'users sync success ', tag: 'sync'}))
            .error((e) => logger.logError({message: e, tag: "sync"}));
        return arr;
    }
}
