import {ResourcesProcessData} from "./ResourcesProcessData";

export class NamespacesProcessData {
    id: string;
    route: string;
    type: string;
    description: string;
    active: boolean;
    resources?: ResourcesProcessData[];

    constructor(
        route: string,
        id?: string,
        type?: string,
        description?: string,
        active?: boolean,
        resources?: ResourcesProcessData[]
    ) {
        const uuid = require('uuid-v4');
        this.route = route;
        this.id = (id !== undefined) ? id : uuid();
        this.type = (type !== undefined) ? type : 'REST';
        this.description = (description !== undefined) ? description : 'Sample Namespace';
        this.active = (active !== undefined) ? active : true;
        this.resources = (resources !== undefined) ? resources : [];
    }
}
