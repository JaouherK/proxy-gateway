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
            const arr: MethodsProcessData[] = [];

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
                arr.push(aux);
            });
            res.send(arr);
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
            res.sendStatus(200);
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
            const value = await Methods.findById(apiData.id);
            if (value === null) {
                throw new Error("An error occurred. Method not found");
            } else {
                res.send(value);
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
            const value = await Methods.findById(id, {include: [Resources]});
            if (value !== null) {
                res.send(value);
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
