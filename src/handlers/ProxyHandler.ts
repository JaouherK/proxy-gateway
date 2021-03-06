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
import {Proxies} from "../models/Proxies";
import {sequelize} from "../sequelize";
import {Strategies} from "../models/Strategies";
import {Features} from "../models/Features";
import {FeaturesStrategies} from "../models/FeaturesStrategies";
import {StratOptions} from "../models/StratOptions";

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

    public static async getAllProxyMappings(logger: JsonConsoleLogger): Promise<ProxyDomain[]> {
        sequelize.addModels([Proxies]);
        Proxies.sync()
            .then(() => logger.log({message: 'namespaces sync success ', tag: 'sync'}))
            .error((e) => logger.logError({message: e, tag: "sync"}));
        const arr: ProxyDomain[] = [];
        try {
            const process: any = await Proxies.findAll({
                order: [
                    ['order', 'DESC']
                ],
            });

            process.forEach((value: any) => {
                const aux: ProxyDomain = new ProxyDomain(
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
                    value.order,
                    value.hiddenFields
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
        Features.sync()
            .then(() => logger.log({message: 'features sync success ', tag: 'sync'}))
            .error((e) => logger.logError({message: e, tag: "sync"}));
        Strategies.sync()
            .then(() => logger.log({message: 'strategies sync success ', tag: 'sync'}))
            .error((e) => logger.logError({message: e, tag: "sync"}));
        FeaturesStrategies.sync()
            .then(() => logger.log({message: 'feature-strategies association sync success ', tag: 'sync'}))
            .error((e) => logger.logError({message: e, tag: "sync"}));
        StratOptions.sync()
            .then(() => logger.log({message: 'strategy-options sync success ', tag: 'sync'}))
            .error((e) => logger.logError({message: e, tag: "sync"}));
        return arr;
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
        let exist = {status: 'empty'};
        if (response !== null) {
            const method = await Methods.findByPk(id);
            exist = (method!.endpointUrl !== response.endpointUrl) ||
            (method!.method !== response.method) ||
            (method!.denyUpload !== response.denyUpload) ||
            (method!.limit !== response.limit) ||
            (method!.authType !== response.authType) ||
            (method!.timeout !== response.timeout) ||
            (method!.integrationType !== response.integrationType) ||
            (method!.hiddenFields !== response.hiddenFields) ||
            (method!.mockResponseBody !== response.mockResponseBody) ||
            (+method!.mockResponseCode !== response.mockResponseCode) ||
            (method!.mockResponseContent !== response.mockResponseContent) ? {status: 'pending'} : {status: 'valid'};
        }
        return exist;
    }
}
