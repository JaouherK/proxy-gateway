import {Request, Response} from 'express';
import {JsonConsoleLogger} from "../../logger/jsonConsoleLogger";
import {Namespaces} from "../../models/Namespaces";
import {Resources} from "../../models/Resources";
import {Methods} from "../../models/Methods";
import {ResourcesProcessData} from "../../api/ResourcesProcessData";
import {MethodsProcessData} from "../../api/MethodsProcessData";
import {InvalidRoutingStructureException} from "../../exceptions/InvalidRoutingStructureException";


export class NamespacesHandler {
    protected logger: JsonConsoleLogger;

    constructor(logger: JsonConsoleLogger) {
        this.logger = logger;
    }


    public async startAll(req: Request, res: Response): Promise<any> {
        try {
            this.logger.logSecurity('♥ FailSafe restart');
            process.exit(1);
        } catch (e) {
            this.logger.logError({
                message: e
            });
            res.sendStatus(404);
        }
    }

    public async getAll(req: Request, res: Response): Promise<any> {
        try {
            const process = await Namespaces.findAll();
            res.send(process);
        } catch (e) {
            this.logger.logError({
                message: e
            });
            res.sendStatus(404);
        }
    }

    public async deleteOne(req: Request, res: Response, id: string): Promise<any> {
        try {
            Namespaces.destroy({where: {id}});
            res.sendStatus(200);
        } catch (e) {
            this.logger.logError({
                message: e
            });
            res.sendStatus(404);
        }
    }

    public async deleteRecursiveOne(req: Request, res: Response, id: string): Promise<any> {
        try {
            const allResources: Resources[] = await Resources.findAll({
                where: {namespacesId: id},
                include: [Methods]
            });

            await allResources.forEach((resource: Resources) => {
                Methods.destroy({where: {resourcesId: resource.id}});
            });

            await Resources.destroy({where: {namespacesId: id}});

            Namespaces.destroy({where: {id}});
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

            const isUpdate = req.body.hasOwnProperty("id");

            const apiData = req.body;
            if (!isUpdate) {
                const uuid = require('uuid-v4');
                apiData.id = uuid();
            }

            await Namespaces.upsert(apiData);

            if (!isUpdate) {
                const uuid = require('uuid-v4');
                const resourceId = uuid();
                await Resources.upsert(
                    new ResourcesProcessData(
                        apiData.id,
                        resourceId
                    ));

                await Methods.upsert(
                    new MethodsProcessData(
                        resourceId
                    ));
            }

            const item = await Namespaces.findById(apiData.id, {
                include: [Resources]
            });
            if (item === null) {
                throw new Error("An error occurred. Store not found");
            } else {
                res.send(item);
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
            const item = await Namespaces.findById(id, {
                include: [Resources]
            });
            if (item !== null) {
                res.send(item);
            } else {
                throw new Error("store not found");
            }
        } catch (e) {
            this.logger.logError({
                message: e
            });
            res.sendStatus(404);
        }
    }

    public async buildRoute(req: Request, res: Response, id: string): Promise<any> {
        try {
            const item = await Namespaces.findById(id);

            const f = 0;
            const arr: any[] = [];

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

            // get the tree here
            const tree = this.list_to_tree(container);

            const generatedTable = this.getDescendants(tree[0], arr, f, item!.route);

            res.send(generatedTable);
        } catch (e) {
            this.logger.logError({
                message: e
            });
            res.send({error: e.message});
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

    private getDescendants(node: ResourcesProcessData, accum: any[], f: number, namespace: string) {
        let i;
        const orig = f;
        if (node.resourcesId === null) {
            if (node.methods!.length === 0) {
                throw new InvalidRoutingStructureException('All resources should have at least one method');
            }
            node.methods!.forEach((element) => {
                accum[f] = {
                    id: element.id,
                    namespacesId: node.namespacesId,
                    namespace,
                    url: '/' + namespace,
                    endpointUrl: element.endpointUrl,
                    https: (element.endpointProtocol === 'https'),
                    method: element.method,
                    denyUpload: element.denyUpload,
                    limit: element.limit,
                    authType: element.authType,
                    timeout: element.timeout,
                    integrationType: element.integrationType,
                    mockResponseBody: element.mockResponseBody,
                    mockResponseCode: element.mockResponseCode,
                    mockResponseContent: element.mockResponseContent,
                    order: f,
                    valid: 1
                };
                f++;
            });
            f--;
        }

        for (i = 0; i < node.childResources!.length; i++) {

            const h = i;
            if (node.childResources![h].methods!.length === 0) {
                throw new InvalidRoutingStructureException('All resources should have at least one method: '
                    + accum[orig].url + '/' + node.childResources![h].path);
            }
            if (node.childResources![h].path === '') {
                throw new InvalidRoutingStructureException('Path should not be empty. Parent path: ' +
                    accum[orig].url + '/' + node.childResources![h].path);
            }

            node.childResources![i].methods!.forEach((element) => {

                if ((element.integrationType === 'HTTP') && (element.endpointUrl === '')) {
                    throw new InvalidRoutingStructureException('Endpoint url is mandatory route: /' +
                        node.childResources![h].path + ' Method: ' + element.method);
                }

                if ((!element.method) || (!element.authType) || (!element.timeout) || (!element.limit)) {
                    throw new InvalidRoutingStructureException('Method || Auth type || Timeout || request limit size is missing. ' +
                        'Parent path: ' + accum[orig].url + '/' + node.childResources![h].path);
                }
                f++;
                accum[f] = {};
                if (element)
                    accum[f] = {
                        id: element.id,
                        namespacesId: node.childResources![h].namespacesId,
                        namespace,
                        url: accum[orig].url + '/' + node.childResources![h].path,
                        endpointUrl: element.endpointUrl,
                        https: (element.endpointProtocol === 'https'),
                        method: element.method,
                        denyUpload: element.denyUpload,
                        limit: element.limit,
                        authType: element.authType,
                        timeout: element.timeout,
                        integrationType: element.integrationType,
                        mockResponseBody: element.mockResponseBody,
                        mockResponseCode: element.mockResponseCode,
                        mockResponseContent: element.mockResponseContent,
                        order: f,
                        valid: 1
                    };
            });

            this.getDescendants(node.childResources![i], accum, f, namespace);
            f = accum!.length + node.childResources![i].methods!.length - 2;
        }
        return accum;
    }
}
