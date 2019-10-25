export class KeysDomain {
    id: string;
    keyHash: string;
    keyPrefix: string;
    name: string;
    throttling: boolean;
    throttlingRate: number;
    throttlingBurst: number;
    quota: boolean;
    quotaRate: number;
    quotaPeriod: number;
    activeFrom: Date;
    activeTo: Date;
    active: boolean;
    consumerId: string;

    constructor(
        id: string,
        keyHash: string,
        keyPrefix: string,
        name: string,
        throttling: boolean,
        throttlingRate: number,
        throttlingBurst: number,
        quota: boolean,
        quotaRate: number,
        quotaPeriod: number,
        activeFrom: Date,
        activeTo: Date,
        active: boolean,
        consumerId: string,
    ) {
        const uuid = require('uuid-v4');
        this.id = (id !== undefined) ? id : uuid();
        this.keyHash = 'Regenerate to get new!';
        this.keyPrefix = (keyPrefix !== undefined) ? keyPrefix : '';
        this.name = (name !== undefined) ? name : '';
        this.throttling = (throttling !== undefined) ? throttling : false;
        this.throttlingRate = (throttlingRate !== undefined) ? throttlingRate : 0;
        this.throttlingBurst = (throttlingBurst !== undefined) ? throttlingBurst : 0;
        this.quota = (quota !== undefined) ? quota : false;
        this.quotaRate = (quotaRate !== undefined) ? quotaRate : 0;
        this.quotaPeriod = (quotaPeriod !== undefined) ? quotaPeriod : 0;
        this.activeFrom = activeFrom ;
        this.activeTo = activeTo;
        this.active = (active !== undefined) ? active : true;
        this.consumerId = (consumerId !== undefined) ? consumerId : '';
    }
}
