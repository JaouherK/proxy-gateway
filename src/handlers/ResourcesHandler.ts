import {Resources} from "../models/Resources";
import {Methods} from "../models/Methods";
import {ResourcesDomain} from "../domains/ResourcesDomain";
import {InputValidationException} from "../exceptions/InputValidationException";
import {Namespaces} from "../models/Namespaces";
import {NotFoundException} from "../exceptions/NotFoundException";
import validator from 'validator';

const {Op} = require("sequelize");


export class ResourcesHandler {

    /**
     * get all resources
     * @return {any}
     */
    public async getAll(): Promise<any> {
        return Resources.findAll({include: [Methods]});
    }

    /**
     * delete a resource
     * @param  {string} id uuid v4 format
     * @param url
     * @return {any}
     */
    public async deleteOne(id: string, url: string): Promise<any> {
        if (!validator.isUUID(id)) {
            throw new InputValidationException('Invalid ID: ' + url);
        }
        return Resources.destroy({where: {id}});
    }

    /**
     * add/update resource
     * @return {any}
     * @param apiData
     * @param url
     */
    public async addOrUpdate(apiData: any, url: string): Promise<any> {
        apiData.path = validator.whitelist(apiData.path, 'a-zA-Z0-9-_:');
        if (!validator.isUUID(apiData.namespacesId)) {
            throw new InputValidationException('Invalid namespace ID: ' + url);
        }
        if (!(await this.existNamespace(apiData.namespacesId))) {
            throw new NotFoundException('Namespace not found: ' + url);
        }

        if (!apiData.hasOwnProperty("id")) {
            if (!(await this.uniqueResource(apiData.path, apiData.namespacesId, apiData.resourcesId))) {
                throw new InputValidationException('Resource already exists for current namespace');
            }
            const uuid = require('uuid-v4');
            apiData.id = uuid();
        }

        if (validator.isEmpty(apiData.path)) {
            throw new InputValidationException('Invalid resource');
        }

        await Resources.upsert(
            new ResourcesDomain(
                apiData.namespacesId,
                apiData.id,
                apiData.resourcesId,
                apiData.path
            ));
        const response = await Resources.findByPk(apiData.id);
        if (response === null) {
            throw new NotFoundException("An error occurred. Resource not found");
        }

        return response;
    }

    /**
     * get resource by ID
     * @param id
     * @param url
     * @return {any}
     */
    public async getById(id: string, url: string): Promise<any> {
        if (!validator.isUUID(id)) {
            throw new InputValidationException('Invalid ID: ' + url);
        }
        const item = await Resources.findByPk(id, {
            include: [Resources, Methods]
        });

        if (item === null) {
            throw new NotFoundException("resource not found");
        }

        return item;
    }

    /**
     * get tree of resources by namespace ID
     * @param id
     * @param url
     * @return {any}
     */
    public async getTreeByNamespace(id: string, url: string): Promise<any> {

        if (!validator.isUUID(id)) {
            throw new InputValidationException('Invalid ID: ' + url);
        }
        const allResources: Resources[] = await Resources.findAll({
            where: {namespacesId: id},
            include: [Methods],
        });

        const container: ResourcesDomain[] = [];

        allResources.forEach((element: Resources) => {
            const restoredMethods = this.orderMethods(element.methods);
            container.push(
                new ResourcesDomain(
                    element.namespacesId,
                    element.id,
                    element.resourcesId,
                    element.path,
                    restoredMethods,
                    [],
                )
            );
        });

        return this.list_to_tree(container);
    }

    /**
     * get methods under a resource ID
     * @param id
     * @param url
     * @return {any}
     */
    public async getByIdMethods(id: string, url: string): Promise<any> {

        if (!validator.isUUID(id)) {
            throw new InputValidationException('Invalid ID: ' + url);
        }

        const response = await Resources.findByPk(id, {
            include: [Methods]
        });

        if (response === null) {
            throw new NotFoundException("resource not found");
        }
        return response;
    }

    /**
     * generate a tree from an array
     * @return {any}
     * @param list
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
     * Check if a resource existence
     * @return {any}
     * @param path
     * @param namespacesId
     * @param resourcesId
     */
    private async uniqueResource(path: string, namespacesId: string, resourcesId: string): Promise<boolean> {
        const counter = await Resources.count(
            {
                where: {
                    [Op.and]: [
                        {'path': path},
                        {'namespacesId': namespacesId},
                        {'resourcesId': resourcesId}
                    ]
                }
            }
        );
        return (counter === 0);
    }

    /**
     * check if a namespace exists by ID
     * @return {any}
     * @param namespacesId
     */
    private async existNamespace(namespacesId: string): Promise<boolean> {
        const counter = await Namespaces.count({where: {'id': namespacesId}});
        return (counter !== 0);
    }

    /**
     * Order methods model by methods
     * @return {any}
     * @param methods
     * @return Methods[]
     */
    private orderMethods(methods: Methods[]): Methods[] {
        methods.sort((a, b) => {
            const textA = a.method.toUpperCase();
            const textB = b.method.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
        return methods;
    }
}
