import {Response, Request} from 'express';
import {JsonConsoleLogger} from "../../logger/jsonConsoleLogger";
import {Methods} from "../../models/Methods";
import {Resources} from "../../models/Resources";
import {MethodsProcessData} from "../../api/MethodsProcessData";


export class MethodsHandler {
    protected logger: JsonConsoleLogger;

    constructor(logger: JsonConsoleLogger) {
        this.logger = logger;
    }


    public async getAll(req: Request, res: Response): Promise<any> {
        try {
            const process = await Methods.findAll({include: [Resources]});
            const response: MethodsProcessData[] = [];

            process.forEach((value: any) => {
                const aux = new MethodsProcessData(
                    value.resourcesId,
                    value.id,
                    value.method,
                    value.authType,
                    value.contentType,
                    value.denyUpload,
                    value.limit,
                    value.integrationType,
                    value.forwardedMethod,
                    value.endpointUrl,
                    value.endpointProtocol,
                    value.contentHandling,
                    value.timeout,
                    value.mockResponseBody,
                    value.mockResponseCode,
                    value.mockResponseContent,
                    value.active
                );
                response.push(aux);
            });
            res.send(response);

            this.logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
        } catch (e) {
            this.logger.logError({
                message: e.message
            });
            res.sendStatus(404);
        }
    }

    public async deleteOne(req: Request, res: Response, id: string): Promise<any> {
        try {
            Methods.destroy({where: {id}});
            const response = {delete: true};
            res.send(response);
            this.logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
        } catch (e) {
            this.logger.logError({
                message: e
            });
            res.sendStatus(404);
        }
    }

    public async addOrUpdate(req: Request, res: Response): Promise<any> {
        try {
            const apiData = req.body;
            if (!apiData.hasOwnProperty("id")) {
                const uuid = require('uuid-v4');
                apiData.id = uuid();
            }
            await Methods.upsert(
                new MethodsProcessData(
                    apiData.resourcesId,
                    apiData.id,
                    apiData.method,
                    apiData.authType,
                    apiData.contentType,
                    apiData.denyUpload,
                    apiData.limit,
                    apiData.integrationType,
                    apiData.forwardedMethod,
                    apiData.endpointUrl,
                    apiData.endpointProtocol,
                    apiData.contentHandling,
                    apiData.timeout,
                    apiData.mockResponseBody,
                    apiData.mockResponseCode,
                    apiData.mockResponseContent,
                    apiData.active,
                )
            );
            const response = await Methods.findByPk(apiData.id);
            if (response === null) {
                throw new Error("An error occurred. Method not found");
            } else {
                res.send(response);
                this.logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
            }
        } catch (e) {
            this.logger.logError({
                message: e.message
            });
            res.sendStatus(404);
        }
    }

    public async getById(req: Request, res: Response, id: string): Promise<any> {
        try {
            const response = await Methods.findByPk(id, {include: [Resources]});
            if (response !== null) {
                res.send(response);
                this.logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
            } else {
                throw new Error("Method not found");
            }
        } catch (e) {
            this.logger.logError({
                message: e.message
            });
            res.sendStatus(404);
        }
    }
}
