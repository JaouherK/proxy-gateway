import {Request, Response} from 'express';
import {JsonConsoleLogger} from "../../logger/jsonConsoleLogger";
import {ProxyProcessData} from "../../api/ProxyProcessData";
import {Proxies} from "../../models/Proxies";
import {InputValidationException} from "../../exceptions/InputValidationException";
import validator from "validator";


export class ProxyHandler {
    protected logger: JsonConsoleLogger;

    constructor(logger: JsonConsoleLogger) {
        this.logger = logger;
    }

    public async getAll(req: Request, res: Response): Promise<any> {
        try {
            const process = await Proxies.findAll({
                order: [
                    ['namespace', 'DESC'],
                    ['order', 'DESC']
                ],
            });
            const response: ProxyProcessData[] = [];

            process.forEach((value: any) => {
                const aux = new ProxyProcessData(
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
                response.push(aux);
            });
            res.send(response);
            this.logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
        } catch (e) {
            this.logger.logError({message: e, tag: "manager"});
            res.status(500).send({error: e.message});
        }
    }

    public async getAllByNamespace(req: Request, res: Response, id: string): Promise<any> {
        try {
            if (!validator.isUUID(id)) {
                throw new InputValidationException('Invalid ID: ' + req.url);
            }
            const process = await Proxies.findAll({
                where: {namespacesId: id},
                order: [
                    ['order', 'DESC']
                ],
            });
            const response: ProxyProcessData[] = [];
            process.forEach((value: any) => {
                const aux = new ProxyProcessData(
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
                response.push(aux);
            });
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

    public async saveRoutes(req: Request, res: Response): Promise<any> {
        try {

            const apiData: ProxyProcessData[] = req.body;

            await Proxies.destroy({
                where: {
                    namespacesId: apiData[0].namespacesId
                },
            });
            apiData.forEach(element => {
                Proxies.upsert(element);
            });

            const response = {save: true};
            res.send(response);
            this.logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
        } catch (e) {
            res.status(500).send({error: e.message});
            this.logger.logError({message: e, tag: "manager"});
        }
    }
}
