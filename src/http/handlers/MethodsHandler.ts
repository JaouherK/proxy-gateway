import {Response, Request} from 'express';
import {JsonConsoleLogger} from "../../logger/jsonConsoleLogger";
import {Methods} from "../../models/Methods";
import {Resources} from "../../models/Resources";
import {MethodsProcessData, SupportedMethods} from "../../api/MethodsProcessData";
import validator from "validator";
import {InputValidationException} from "../../exceptions/InputValidationException";
import {NotFoundException} from "../../exceptions/NotFoundException";


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
            this.logger.logError({message: e, tag: "manager"});
            res.status(500).send({error: e.message});
        }
    }

    public async deleteOne(req: Request, res: Response, id: string): Promise<any> {
        try {
            if (!validator.isUUID(id)) {
                throw new InputValidationException('Invalid ID: ' + req.url);
            }
            Methods.destroy({where: {id}});
            const response = {delete: true};
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

    public async addOrUpdate(req: Request, res: Response): Promise<any> {
        try {
            const apiData = req.body;

            if (!validator.isUUID(apiData.resourcesId)) {
                throw new InputValidationException('Invalid resource ID: ' + req.url);
            }
            if (!(await this.existResource(apiData.resourcesId))) {
                throw new NotFoundException('Resource not found: ' + req.url);
            }

            if (!apiData.hasOwnProperty("id")) {
                apiData.method = (apiData.method !== undefined) ? apiData.method : SupportedMethods.get;
                if (!(await this.uniqueMethod(apiData.method, apiData.resourcesId))) {
                    throw new InputValidationException('Method already exists for current resource');
                }
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
                throw new NotFoundException("An error occurred. Method not found");
            } else {
                res.send(response);
                this.logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
            }
        } catch (e) {
            if (e instanceof InputValidationException) {
                res.status(409).send({error: e.message});
            } else if (e instanceof NotFoundException) {
                res.status(404).send({error: e.message});
            } else {
                res.status(500).send({error: e.message});
            }
            this.logger.logError({message: e, tag: "manager"});
        }
    }

    public async getById(req: Request, res: Response, id: string): Promise<any> {
        try {
            if (!validator.isUUID(id)) {
                throw new InputValidationException('Invalid ID: ' + req.url);
            }
            const response = await Methods.findByPk(id, {include: [Resources]});
            if (response !== null) {
                res.send(response);
                this.logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
            } else {
                throw new NotFoundException("Method not found");
            }
        } catch (e) {
            if (e instanceof InputValidationException) {
                res.status(409).send({error: e.message});
            } else if (e instanceof NotFoundException) {
                res.status(404).send({error: e.message});
            } else {
                res.status(500).send({error: e.message});
            }
            this.logger.logError({message: e, tag: "manager"});
        }
    }

    private async existResource(resourceId: string): Promise<boolean> {
        const counter = await Resources.count({where: {'id': resourceId}});
        return (counter !== 0)
    }

    private async uniqueMethod(method: string, resourcesId: string): Promise<boolean> {
        const counter = await Methods.count(
            {
                where: {
                    'method': method,
                    'resourcesId': resourcesId
                }
            }
        );
        return (counter === 0)
    }
}
