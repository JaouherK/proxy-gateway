import {Response, Request} from 'express';
import {JsonConsoleLogger} from "../../logger/jsonConsoleLogger";
import {Resources} from "../../models/Resources";
import {Methods} from "../../models/Methods";
import {ResourcesProcessData} from "../../api/ResourcesProcessData";

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
            this.logger.logError({
                message: e
            });
            res.sendStatus(404);
        }
    }

    public async deleteOne(req: Request, res: Response, id: string): Promise<any> {
        try {
            Resources.destroy({where: {id}});
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
            await Resources.upsert(
                new ResourcesProcessData(
                    apiData.namespacesId,
                    apiData.id,
                    apiData.resourcesId,
                    apiData.path
                ));
            const response = await Resources.findByPk(apiData.id);
            if (response === null) {
                throw new Error("An error occurred. Resource not found");
            } else {
                res.send(response);
                this.logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
            }
        } catch (e) {
            this.logger.logError({
                message: e
            });
            res.sendStatus(404);
        }
    }

    public async getById(req: Request, res: Response, id: string): Promise<any> {
        try {
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
                throw new Error("resource not found");
            }
        } catch (e) {
            this.logger.logError({
                message: e
            });
            res.sendStatus(404);
        }
    }


    public async getTreeByNamespace(req: Request, res: Response, id: string): Promise<any> {
        try {
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
            this.logger.logError({
                message: e
            });
            res.sendStatus(404);
        }
    }

    public async getByIdMethods(req: Request, res: Response, id: string): Promise<any> {
        try {
            const response = await Resources.findByPk(id, {
                include: [Methods]
            });


            if (response !== null) {
                res.send(response);
                this.logger.log({managing_route: req.url, payload: req.body, response, tag: "manager"});
            } else {
                throw new Error("resource not found");
            }
        } catch (e) {
            this.logger.logError({
                message: e
            });
            res.sendStatus(404);
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
}
