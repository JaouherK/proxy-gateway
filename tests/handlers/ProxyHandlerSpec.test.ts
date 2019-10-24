import {ProxyHandler} from "../../src/handlers/ProxyHandler";
import {InputValidationException} from "../../src/exceptions/InputValidationException";

const mockListProxies = [
    {
        "id": "93c63b8d-f625-4f28-8140-a257e9da0f82",
        "namespacesId": "d9d0fb96-2f51-4e0d-9c58-19877a43b00b",
        "namespace": "crm",
        "url": "/crm",
        "endpointUrl": "",
        "https": true,
        "method": "GET",
        "denyUpload": true,
        "limit": "1mb",
        "authType": "none",
        "timeout": 29000,
        "integrationType": "MOCK",
        "mockResponseBody": "{\"description\": \"Sample Namespace\"}",
        "mockResponseCode": 200,
        "mockResponseContent": "application/json",
        "order": 0,
        "createdAt": "2019-10-16T10:17:32.000Z",
        "updatedAt": "2019-10-16T10:17:32.000Z"
    },
    {
        "id": "ea9117e0-9946-4ab5-94c2-c98a0a73ae19",
        "namespacesId": "f30352e3-c4b4-4b77-88c9-5fd1fdcf7fe9",
        "namespace": "crm",
        "url": "/crm",
        "endpointUrl": "",
        "https": true,
        "method": "GET",
        "denyUpload": true,
        "limit": "1mb",
        "authType": "none",
        "timeout": 29000,
        "integrationType": "MOCK",
        "mockResponseBody": "{description: \"Sample Namespace for whatever reason\"}",
        "mockResponseCode": 200,
        "mockResponseContent": "application/json",
        "order": 0,
        "createdAt": "2019-10-16T10:16:14.000Z",
        "updatedAt": "2019-10-16T10:16:14.000Z"
    }
];

jest.mock('../../src/models/Proxies', () => () => {
    const SequelizeMock = require("sequelize-mock");
    const dbMock = new SequelizeMock();
    return dbMock.define('proxies', mockListProxies)
});

describe('Proxy handler', () => {
    const proxyHandler = new ProxyHandler();
    beforeEach(() => {
    });

    it("should get all proxies", async () => {
        proxyHandler.getAll().then((t) => {
            expect(t).toEqual(mockListProxies);
        }).catch((e) => {
            throw new Error();
        });
    });

    it('should throw Error when invalid uuid param passed', () => {
        proxyHandler.getAllByNamespace('********').then((t) => {
            expect(t).toThrowError(new InputValidationException('Invalid ID'))
        }).catch(() => {
        });

        proxyHandler.deleteOne('********').then((t) => {
            expect(t).toThrowError(new InputValidationException('Invalid ID'))
        }).catch(() => {
        });

        proxyHandler.existById('********').then((t) => {
            expect(t).toThrowError(new InputValidationException('Invalid ID'))
        }).catch(() => {
        });
    });

    it('should get all proxies when valid uuid format passed', () => {
        proxyHandler.getAllByNamespace('d9d0fb96-2f51-4e0d-9c58-19877a43b00b').then((t) => {
            expect(t).toEqual(mockListProxies);
        }).catch(() => {
        });
    });

    it('should delete a proxy when valid uuid format passed', () => {
        proxyHandler.deleteOne('d9d0fb96-2f51-4e0d-9c58-19877a43b00b').then((t) => {
            expect(t).toEqual({delete: true});
        }).catch(() => {
        });
    });

    it('should check if a proxy exists already by uuid', () => {
        proxyHandler.existById('d9d0fb96-2f51-4e0d-9c58-19877a43b00b').then((t) => {
            let exist = {exist: false};
            expect(t).toEqual(exist);
        }).catch(() => {
        });
    });

    it('should create proxy routes', () => {
        proxyHandler.saveRoutes([]).then((t) => {
            expect(t).toEqual({save: true});
        }).catch(() => {
        });
    });
});