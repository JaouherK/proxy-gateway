import {Response, Request} from 'express';
import {JsonConsoleLogger} from "../../logger/jsonConsoleLogger";
import {Resources} from "../../models/Resources";
import {Methods} from "../../models/Methods";
import {ResourcesProcessData} from "../../api/ResourcesProcessData";
import validator from 'validator';
import {InputValidationException} from "../../exceptions/InputValidationException";
import {Namespaces} from "../../models/Namespaces";
import {NotFoundException} from "../../exceptions/NotFoundException";

export class ResourcesHandler {
    protected logger: JsonConsoleLogger;

    constructor(logger: JsonConsoleLogger) {
        this.logger = logger;
    }


    public async getAll(req: Request, res: Response): Promise<any> {
        try {
            const process = await Resources.findAll({include: [Methods]});
            const response: ResourcesProcessData[] = [];

            process.forEach((value: any) => {
                const aux = new ResourcesProcessData(
                    value.namespacesId,
                    value.id,
                    value.resourcesId,
                    value.path,
                    value.methods,
                    value.childResources
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
            Resources.destroy({where: {id}});
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

            if (!validator.isUUID(apiData.namespacesId)) {
                throw new InputValidationException('Invalid namespace ID: ' + req.url);
            }
            if (!(await this.existNamespace(apiData.namespacesId))) {
                throw new NotFoundException('Namespace not found: ' + req.url);
            }
            if (!apiData.hasOwnProperty("id")) {
                if (!(await this.uniqueResource(apiData.path, apiData.namespacesId, apiData.resourcesId))) {
                    throw new InputValidationException('Resource already exists for current namespace');
                }
                const uuid = require('uuid-v4');
                apiData.id = uuid();
            }

            if ((validator.isEmpty(apiData.path)) || (validator.contains(apiData.path, '/'))) {
                throw new InputValidationException('Invalid resource');
            }

            await Resources.upsert(
                new ResourcesProcessData(
                    apiData.namespacesId,
                    apiData.id,
                    apiData.resourcesId,
                    apiData.path
                ));
            const response = await Resources.findByPk(apiData.id);
            if (response === null) {
                throw new NotFoundException("Resource not found");
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
            const item = await Resources.findByPk(id, {
                include: [Resources, Methods]
            });

            if (item !== null) {
                const response = new ResourcesProcessData(
                    item.namespacesId,
                    item.id,
                    item.resourcesId,
                    item.path,
                    item.methods,
                    item.childResources
                );
                res.send(response);

                this.logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
            } else {
                throw new NotFoundException("Resource not found");
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


    public async getTreeByNamespace(req: Request, res: Response, id: string): Promise<any> {
        try {
            if (!validator.isUUID(id)) {
                throw new InputValidationException('Invalid ID: ' + req.url);
            }
            const allResources: Resources[] = await Resources.findAll({
                where: {namespacesId: id},
                include: [Methods]
            });

            const container: ResourcesProcessData[] = [];

            allResources.forEach((element: Resources) => {
                container.push(new ResourcesProcessData(
                    element.namespacesId,
                    element.id,
                    element.resourcesId,
                    element.path,
                    element.methods,
                    [],
                ));
            });

            const response = this.list_to_tree(container);
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

    public async getByIdMethods(req: Request, res: Response, id: string): Promise<any> {
        try {
            if (!validator.isUUID(id)) {
                throw new InputValidationException('Invalid ID: ' + req.url);
            }
            const response = await Resources.findByPk(id, {
                include: [Methods]
            });


            if (response !== null) {
                res.send(response);
                this.logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
            } else {
                throw new NotFoundException("Resource not found");
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

    private list_to_tree(list: ResourcesProcessData[]) {
        const map: any = {};
        let i;
        let node;
        const roots = [];
        for (i = 0; i < list.length; i += 1) {
            map[list[i].id] = i; // initialize the map
        }

        for (i = 0; i < list.length; i += 1) {
            node = list[i];
            if (node.resourcesId !== null) {
                list[map[node.resourcesId]].childResources!.push(node);

            } else {
                roots.push(node);
            }
        }
        return roots;
    }

    private async uniqueResource(path: string, namespacesId: string, resourcesId: string): Promise<boolean> {
        await Resources.findAll({
            where: {
                'path': path,
                'namespacesId': namespacesId,
                'resourcesId': resourcesId
            }, logging: console.log
        });
        const counter = await Resources.count(
            {
                where: {
                    'path': path,
                    'namespacesId': namespacesId,
                    'resourcesId': resourcesId
                }
            }
        );
        return (counter === 0)
    }

    private async existNamespace(namespacesId: string): Promise<boolean> {
        const counter = await Namespaces.count({where: {'id': namespacesId}});
        return (counter !== 0)
    }
}
