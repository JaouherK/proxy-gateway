import {Request, Response} from 'express';
import {Namespaces} from "../models/Namespaces";
import {Resources} from "../models/Resources";
import {Methods} from "../models/Methods";
import {ResourcesDomain} from "../domains/ResourcesDomain";
import {MethodsDomains} from "../domains/MethodsDomains";
import {InvalidRoutingStructureException} from "../exceptions/InvalidRoutingStructureException";
import {InputValidationException} from "../exceptions/InputValidationException";
import {NotFoundException} from "../exceptions/NotFoundException";
import validator from 'validator';
import SwaggerParser from "swagger-parser";


export class NamespacesHandler {

    /**
     * get all namespaces/stores
     * @return {any}
     */
    public async getAll(): Promise<any> {
        return Namespaces.findAll();
    }

    public async deleteOne(id: string, url: string): Promise<any> {
        if (!validator.isUUID(id)) {
            throw new InputValidationException('Invalid ID: ' + url);
        }
        return Namespaces.destroy({where: {id}});
    }

    /**
     * delete a namespace and all its tree structure
     * @param  {string} id uuid v4 format
     * @param  {string} url
     * @return {any}
     */
    public async deleteRecursiveOne(id: string, url: string): Promise<any> {
        if (!validator.isUUID(id)) {
            throw new InputValidationException('Invalid ID: ' + url);
        }
        const allResources: Resources[] = await Resources.findAll({
            where: {namespacesId: id},
            include: [Methods]
        });

        // destroy first the methods
        await allResources.forEach((resource: Resources) => {
            Methods.destroy({where: {resourcesId: resource.id}});
        });

        // destroy the resources
        await Resources.destroy({where: {namespacesId: id}});

        // destroy finally the namespace
        return Namespaces.destroy({where: {id}});
    }

    /**
     * add/update namespace
     * @return {any}
     * @param apiData
     * @param url
     */
    public async addOrUpdate(apiData: any, url: string): Promise<any> {

        const isUpdate = apiData.hasOwnProperty("id");

        apiData.route = validator.whitelist(apiData.route, 'a-zA-Z0-9-_');
        if (!isUpdate) {
            if (!(await this.uniqueRoute(apiData.route))) {
                throw new InputValidationException('Namespace already exists');
            }
            const uuid = require('uuid-v4');
            apiData.id = uuid();
        }

        if (!validator.isUUID(apiData.id)) {
            throw new InputValidationException('Invalid ID: ' + url);
        }
        if ((validator.isEmpty(apiData.route)) || (validator.contains(apiData.route, '/'))) {
            throw new InputValidationException('Invalid namespace');
        }

        apiData.type = (apiData.type !== undefined) ? apiData.type : 'REST';
        apiData.description = (apiData.description !== undefined) ? apiData.description : 'Sample description for ' + apiData.route;
        apiData.active = (apiData.active !== undefined) ? apiData.active : true;

        await Namespaces.upsert(apiData);

        if (!isUpdate) {
            const uuid = require('uuid-v4');
            const resourceId = uuid();
            await Resources.upsert(
                new ResourcesDomain(
                    apiData.id,
                    resourceId
                ));

            await Methods.upsert(
                new MethodsDomains(
                    resourceId,
                    undefined,
                    'GET',
                    'none',
                    undefined,
                    undefined,
                    undefined,
                    'MOCK',
                    'GET',
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    '{"description": "' + apiData.description + '"}'
                ));
        }

        const response = await Namespaces.findById(apiData.id, {
            include: [Resources]
        });
        if (response === null) {
            throw new NotFoundException("An error occurred. Store not found");
        }

        return response;
    }

    /**
     * get namespace by ID
     * @param  {string} id  uuid v4 format
     * @param  {string} url
     * @return {any}
     */
    public async getById(id: string, url: string): Promise<any> {
        if (!validator.isUUID(id)) {
            throw new InputValidationException('Invalid ID: ' + url);
        }
        const response = await Namespaces.findById(id, {
            include: [Resources]
        });
        if (response === null) {
            throw new NotFoundException("Namespace not found");
        }
        return response;
    }

    /**
     * get the full tree of the namespace including resources and methods
     * @param  {string} id  uuid v4 format
     * @param url
     * @return {any}
     */
    public async buildRoute(id: string, url: string): Promise<any> {

        if (!validator.isUUID(id)) {
            throw new InputValidationException('Invalid ID: ' + url);
        }
        const item = await Namespaces.findById(id);

        const f = 0;
        const arr: any[] = [];

        const allResources: Resources[] = await Resources.findAll({
            where: {namespacesId: id},
            include: [Methods]
        });

        const container: ResourcesDomain[] = [];

        allResources.forEach((element: Resources) => {
            container.push(new ResourcesDomain(
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

        return this.getDescendants(tree[0], arr, f, item!.route);
    }

    public async generateFromSwagger(req: Request, res: Response): Promise<any> {

        //todo: unicity of route
        const namespace = req.body.namespace;
        const myAPI = req.body.swag;
        let apiData: any = {};

        if ((validator.isEmpty(namespace)) || (validator.contains(namespace, '/'))) {
            throw new InputValidationException('Invalid namespace');
        }


        let api = await SwaggerParser.validate(myAPI);


        apiData.route = namespace;
        apiData.type = 'REST';
        apiData.description = (api.info.title !== undefined) ? api.info.title : 'Sample description for ' + namespace;
        apiData.getDescription = (api.info.description !== undefined) ? api.info.description : 'Sample description for ' + namespace;
        apiData.active = true;
        const uuid = require('uuid-v4');
        apiData.id = uuid();

        await Namespaces.upsert(apiData);
        // const resourceId = uuid();
        // await Resources.upsert(
        //     {
        //         namespacesId: apiData.id,
        //
        //         id : resourceId,
        //         resourcesId : null,
        //         path :  '',
        //         methods : [],
        //         childResources : []
        //     },
        // );
        // await Methods.upsert(
        //     new MethodsDomains(
        //         resourceId,
        //         undefined,
        //         'GET',
        //         'none',
        //         undefined,
        //         undefined,
        //         undefined,
        //         'MOCK',
        //         'GET',
        //         undefined,
        //         undefined,
        //         undefined,
        //         undefined,
        //         '{"description": "' + apiData.getDescription + '"}'
        //     ));

        const d: string = myAPI.basePath;
        const t = d.split('/');

        let childId = '';
        let parentId = null;

        await t.forEach(async (item) => {
            console.log(item);
            parentId = childId;
            childId = uuid();
            console.log({
                namespacesId: apiData.id,
                id: childId,
                resourcesId: parentId,
                path: validator.whitelist(item, 'a-zA-Z0-9-_'),
                methods: [],
                childResources: []
            });


            await Resources.upsert(
                {
                    namespacesId: apiData.id,
                    id: childId,
                    resourcesId: parentId,
                    path: validator.whitelist(item, 'a-zA-Z0-9-_'),
                    methods: [],
                    childResources: []
                },
            );

            // await Methods.upsert(
            //     new MethodsDomains(
            //         childId,
            //         undefined,
            //         'GET',
            //         'none',
            //         undefined,
            //         undefined,
            //         undefined,
            //         'MOCK',
            //         'GET',
            //         undefined,
            //         undefined,
            //         undefined,
            //         undefined,
            //         '{}'
            //     ));

        });


        const response = await Namespaces.findByPk(apiData.id, {
            include: [Resources]
        });
        if (response === null) {
            throw new NotFoundException("Namespace not initialised");
        } else {
            res.send(response);
        }

    }

    /**
     * build a tree from a an array
     * @access  private
     * @param  {ResourcesDomain[]} list
     * @return {any}
     */
    private list_to_tree(list: ResourcesDomain[]) {
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

    /**
     * recursive function to generate the descendants in a table array combining full route
     * @access  private
     * @param  {ResourcesDomain} node
     * @param  {any[]} accum
     * @param  {number} f
     * @param  {string} namespace
     * @return {any}
     */
    private getDescendants(node: ResourcesDomain, accum: any[], f: number, namespace: string) {
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

    /**
     * check if a route is unique to avoid duplicate
     * @access  private
     * @param  {string} route
     * @return {boolean}
     */
    private async uniqueRoute(route: string): Promise<boolean> {
        const counter = await Namespaces.count({where: {'route': route}});
        return (counter === 0);
    }
}
