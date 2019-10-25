export class ConsumersDomain {
    id: string;
    username: string;
    email: string;
    customId: string;
    active: boolean;
    keys?: any[];

    constructor(
        username: string,
        id?: string,
        email?: string,
        active?: boolean,
        customId?: string,
        keys?: any[]
    ) {
        const uuid = require('uuid-v4');
        this.username = username;
        this.id = (id !== undefined) ? id : uuid();
        this.email = (email !== undefined) ? email : '';
        this.customId = (customId !== undefined) ? customId : '';
        this.active = (active !== undefined) ? active : true;
        this.keys = (keys !== undefined) ? keys : [];
    }
}
