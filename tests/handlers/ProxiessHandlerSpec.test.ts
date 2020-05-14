import {ProxyHandler} from "../../src/handlers/ProxyHandler";
import {Proxies} from "../../src/models/Proxies";
import {Methods} from "../../src/models/Methods";
import {InputValidationException} from "../../src/exceptions/InputValidationException";

describe('ProxiesHandler', () => {
    const handler = new ProxyHandler();

    const SequelizeMock = require('sequelize-mock');

    const DbConnectionMock = new SequelizeMock();

    const proxy = {
        id: "c3d8ea3b-47e3-48b6-b5f0-f7c78ad36e1c",
        namespacesId: "f0929c46-67b2-459c-88ce-d6e8f258bbdd",
        namespace: "test-under",
        url: "/test-under",
        endpointUrl: "",
        https: true,
        method: "GET",
        denyUpload: true,
        limit: "1mb",
        authType: "none",
        timeout: 29000,
        integrationType: "MOCK",
        mockResponseBody: "{\"description\": \"Sample Namespace\"}",
        mockResponseCode: "200",
        mockResponseContent: "json",
        order: 0
    };

    const methodAlt = {
        id: "c3d8ea3b-47e3-48b6-b5f0-f7c78ad36e1c",
        resourcesId: "353dd787-c746-42c7-aa9e-50d0e72998d4",
        method: "GET",
        authType: "none",
        contentType: "json",
        denyUpload: true,
        active: true,
        limit: "1mb",
        integrationType: "MOCK",
        forwardedMethod: "GET",
        endpointUrl: "",
        endpointProtocol: "https",
        contentHandling: "Passthrough",
        timeout: 29000,
        mockResponseBody: "{\"description\": \"Sample Namespace\"}",
        mockResponseCode: 200,
        mockResponseContent: "json"
    };

    const proxiesMock = DbConnectionMock.define('Proxies', proxy);
    const methodsAltMock = DbConnectionMock.define('Methods', methodAlt);

    it("Should get all proxies", async () => {

        const spyOnProxiesFindAll = spyOn<any>(Proxies, 'findAll');
        spyOnProxiesFindAll.and.callFake(async () => {
            const apiList = await proxiesMock.findAll({
                order: [
                    ['namespace', 'DESC'],
                    ['order', 'DESC']
                ],
            });
            return apiList[0].dataValues;
        });

        const list = await handler.getAll();
        expect(await spyOnProxiesFindAll).toHaveBeenCalled();
        expect(list.id).toEqual(proxy.id);
        expect(list.namespacesId).toEqual(proxy.namespacesId);
        expect(list.namespace).toEqual(proxy.namespace);
        expect(list.url).toEqual(proxy.url);
        expect(list.endpointUrl).toEqual(proxy.endpointUrl);
        expect(list.https).toEqual(proxy.https);
        expect(list.method).toEqual(proxy.method);
        expect(list.denyUpload).toEqual(proxy.denyUpload);
        expect(list.limit).toEqual(proxy.limit);
        expect(list.authType).toEqual(proxy.authType);
        expect(list.timeout).toEqual(proxy.timeout);
        expect(list.integrationType).toEqual(proxy.integrationType);
        expect(list.mockResponseBody).toEqual(proxy.mockResponseBody);
        expect(list.mockResponseCode).toEqual(proxy.mockResponseCode);
        expect(list.mockResponseContent).toEqual(proxy.mockResponseContent);
        expect(list.order).toEqual(proxy.order);
        expect(Object.keys(list)).toContain('createdAt');
        expect(Object.keys(list)).toContain('updatedAt');
    });

    it("Should get all proxies by namespace ID", async () => {

        const spyOnProxiesFindAll = spyOn<any>(Proxies, 'findAll');
        spyOnProxiesFindAll.and.callFake(async () => {
            const apiList = await proxiesMock.findAll({
                where: {namespacesId: "f0929c46-67b2-459c-88ce-d6e8f258bbdd"},
                order: [
                    ['order', 'DESC']
                ],
            });
            return apiList[0].dataValues;
        });

        const list = await handler.getAllByNamespace("f0929c46-67b2-459c-88ce-d6e8f258bbdd");


        expect(await spyOnProxiesFindAll).toHaveBeenCalled();
        expect(list.id).toEqual(proxy.id);
        expect(list.namespacesId).toEqual(proxy.namespacesId);
        expect(list.namespace).toEqual(proxy.namespace);
        expect(list.url).toEqual(proxy.url);
        expect(list.endpointUrl).toEqual(proxy.endpointUrl);
        expect(list.https).toEqual(proxy.https);
        expect(list.method).toEqual(proxy.method);
        expect(list.denyUpload).toEqual(proxy.denyUpload);
        expect(list.limit).toEqual(proxy.limit);
        expect(list.authType).toEqual(proxy.authType);
        expect(list.timeout).toEqual(proxy.timeout);
        expect(list.integrationType).toEqual(proxy.integrationType);
        expect(list.mockResponseBody).toEqual(proxy.mockResponseBody);
        expect(list.mockResponseCode).toEqual(proxy.mockResponseCode);
        expect(list.mockResponseContent).toEqual(proxy.mockResponseContent);
        expect(list.order).toEqual(proxy.order);
        expect(Object.keys(list)).toContain('createdAt');
        expect(Object.keys(list)).toContain('updatedAt');
    });

    it("Should check if proxy does not exist by ID", async () => {

        const spyOnProxiesDeleteById = spyOn<any>(Proxies, 'findByPk');
        spyOnProxiesDeleteById.and.callFake(async () => {
            return proxiesMock.findById("c3d8ea3b-47e3-48b6-b5f0-f7c78ad36e1c").thenReturn(null);
        });

        await handler.existById("c3d8ea3b-47e3-48b6-b5f0-f7c78ad36e1c")
            .then((t) => {
                    expect(spyOnProxiesDeleteById).toHaveBeenCalled();
                    expect(t).toEqual({status: 'empty'});
                }
            );
    });

    it("Should check if proxy exist by ID but pending status", async () => {

        const spyOnProxiesDeleteById = spyOn<any>(Proxies, 'findByPk');
        spyOnProxiesDeleteById.and.callFake(async () => {
            return proxiesMock.findById("c3d8ea3b-47e3-48b6-b5f0-f7c78ad36e1c");
        });

        const spyOnMethodById = spyOn<any>(Methods, 'findByPk');
        spyOnMethodById.and.callFake(async () => {
            return methodsAltMock.findById("c3d8ea3b-47e3-48b6-b5f0-f7c78ad36e1c");
        });

        await handler.existById("c3d8ea3b-47e3-48b6-b5f0-f7c78ad36e1c")
            .then((t) => {
                    expect(spyOnProxiesDeleteById).toHaveBeenCalled();
                    expect(spyOnMethodById).toHaveBeenCalled();
                    expect(t).toEqual({status: 'pending'});
                }
            );
    });

    it("Should delete a proxy by ID", async () => {

        const spyOnProxiesDeleteById = spyOn<any>(Proxies, 'destroy');
        spyOnProxiesDeleteById.and.callFake(async () => {
            return proxiesMock.destroy({where: {id: "c3d8ea3b-47e3-48b6-b5f0-f7c78ad36e1c"}});
        });

        await handler.deleteOne("c3d8ea3b-47e3-48b6-b5f0-f7c78ad36e1c");
        expect(await spyOnProxiesDeleteById).toHaveBeenCalled();
    });

    it("Should save successfully a list of proxies", async () => {

        const spyOnProxiesByNamespace = spyOn<any>(Proxies, 'destroy');
        spyOnProxiesByNamespace.and.callFake(async () => {
            return proxiesMock.destroy(
                {where: {id: "c3d8ea3b-47e3-48b6-b5f0-f7c78ad36e1c"}}
            );
        });

        const spyOnUpsertProxies = spyOn<any>(Proxies, 'upsert');
        spyOnUpsertProxies.and.callFake(async () => {
            return proxiesMock.upsert(proxy);
        });

        const proxies = [proxy];
        await handler
            .saveRoutes([proxy])
            .then(t => {
                expect(spyOnProxiesByNamespace).toHaveBeenCalled();
                proxies.forEach((element: any) => {
                    expect(spyOnUpsertProxies).toHaveBeenCalled();
                });
                expect(t).toEqual({save: true});
            });
    });

    it('should throw Error when invalid uuid param passed', () => {

        handler.deleteOne('**********').then((t) => {
            expect(t).toThrow(new InputValidationException('Invalid ID'));
        }).catch(() => {
        });

        handler.existById('***********').then((t) => {
            expect(t).toThrow(new InputValidationException('Invalid resource ID: url'));
        }).catch(() => {
        });

        handler.getAllByNamespace('********').then((t) => {
            expect(t).toThrow(new InputValidationException('Invalid ID: url'));
        }).catch(() => {
        });
    });
});
