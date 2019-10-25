import {ResourcesDomain} from "./ResourcesDomain";

export class NamespacesDomain {
    id: string;
    route: string;
    type: string;
    description: string;
    active: boolean;
    resources?: ResourcesDomain[];

    constructor(
        route: string,
        id?: string,
        type?: string,
        description?: string,
        active?: boolean,
        resources?: ResourcesDomain[]
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
