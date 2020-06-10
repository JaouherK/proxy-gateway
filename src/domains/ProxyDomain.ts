export class ProxyDomain {
    id: string;
    namespacesId: string;
    namespace: string;
    url: string;
    endpointUrl: string;
    https: boolean;
    method: string;
    denyUpload: boolean;
    limit: string;
    authType: string;
    timeout: number;
    integrationType: string;
    mockResponseBody: string;
    mockResponseCode: number;
    mockResponseContent: string;
    order: number;
    hiddenFields?: string;

    constructor(
        id: string,
        namespacesId: string,
        namespace: string,
        url: string,
        endpointUrl: string,
        https: boolean,
        method: string,
        denyUpload: boolean,
        limit: string,
        authType: string,
        timeout: number,
        integrationType: string,
        mockResponseBody: string,
        mockResponseCode: number,
        mockResponseContent: string,
        order: number,
        hiddenFields = ''
    ) {
        this.id = id;
        this.namespacesId = namespacesId;
        this.namespace = namespace;
        this.url = url;
        this.endpointUrl = endpointUrl;
        this.https = https;
        this.method = method;
        this.denyUpload = denyUpload;
        this.limit = limit;
        this.authType = authType;
        this.timeout = timeout;
        this.integrationType = integrationType;
        this.mockResponseBody = mockResponseBody;
        this.mockResponseCode = mockResponseCode;
        this.mockResponseContent = mockResponseContent;
        this.order = order;
        this.hiddenFields = hiddenFields;
    }
}
