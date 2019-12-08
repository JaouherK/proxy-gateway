export enum SupportedMethods {
    get = 'GET',
    any = 'ANY',
    options = 'OPTIONS',
    post = 'POST',
    put = 'PUT',
    patch = 'PATCH'
}

export enum SupportedContentTypes {
    json = 'application/json',
    jsonApi = 'application/json-api'
}

export enum SupportedIntegrationTypes {
    http = 'HTTP',
    mock = 'mock'
}

export enum SupportedContentHandling {
    pass = 'Passthrough'
}


export class MethodsDomains {
    id: string;
    resourcesId: string;
    method: string;
    authType: string;
    contentType: string;
    denyUpload: boolean;
    limit: string;
    integrationType: string;
    forwardedMethod: string;
    endpointUrl: string;
    endpointProtocol: string;
    contentHandling: string;
    timeout: number;
    mockResponseBody: string;
    mockResponseCode: number;
    mockResponseContent: string;
    active: boolean;


    constructor(
        resourcesId: string,
        id?: string,
        method?: string,
        authType?: string,
        contentType?: string,
        denyUpload?: boolean,
        limit?: string,
        integrationType?: string,
        forwardedMethod?: string,
        endpointUrl?: string,
        endpointProtocol?: string,
        contentHandling?: string,
        timeout?: number,
        mockResponseBody?: string,
        mockResponseCode?: number,
        mockResponseContent?: string,
        active?: boolean
    ) {
        this.resourcesId = resourcesId;
        const uuid = require('uuid-v4');
        this.id = (id !== undefined) ? id : uuid();
        this.method = (method !== undefined) ? method : SupportedMethods.get;
        this.authType = (authType !== undefined) ? authType : 'jwt';
        this.contentType = (contentType !== undefined) ? contentType : SupportedContentTypes.json;
        this.denyUpload = (denyUpload !== undefined) ? denyUpload : true;
        this.active = (active !== undefined) ? active : true;
        this.limit = (limit !== undefined) ? limit : '1mb';
        this.integrationType = (integrationType !== undefined) ? integrationType : SupportedIntegrationTypes.http;
        this.forwardedMethod = (forwardedMethod !== undefined) ? forwardedMethod : SupportedMethods.get;
        this.endpointUrl = (endpointUrl !== undefined) ? endpointUrl : '';
        this.endpointProtocol = (endpointProtocol !== undefined) ? endpointProtocol : 'https';
        this.contentHandling = (contentHandling !== undefined) ? contentHandling : SupportedContentHandling.pass;
        this.timeout = (timeout !== undefined) ? timeout : 29000;
        this.mockResponseBody = (mockResponseBody !== undefined) ? mockResponseBody : '{}';
        this.mockResponseCode = (mockResponseCode !== undefined) ? mockResponseCode : 200;
        this.mockResponseContent = (mockResponseContent !== undefined) ? mockResponseContent : SupportedContentTypes.json;
        this.active = (active !== undefined) ? active : true;
    }

}
