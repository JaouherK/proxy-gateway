import {Methods} from "../models/Methods";

export class ResourcesProcessData {
    id: string;
    namespacesId: string;
    resourcesId: string | null;
    path: string;
    methods?: Methods[];
    childResources?: ResourcesProcessData[];


    constructor(
        namespacesId: string,
        id?: string,
        resourcesId?: string | null,
        path?: string,
        methods?: Methods[],
        childResources?: ResourcesProcessData[]
    ) {
        this.namespacesId = namespacesId;
        const uuid = require('uuid-v4');
        this.id = (id !== undefined) ? id : uuid();
        this.resourcesId = (resourcesId !== undefined) ? resourcesId : null;
        this.path = (path !== undefined) ? path : '';
        this.methods = (methods !== undefined) ? methods : [];
        this.childResources = (childResources !== undefined) ? childResources : [];
    }
}
