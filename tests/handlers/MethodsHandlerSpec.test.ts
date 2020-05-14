import {MethodsHandler} from "../../src/handlers/MethodsHandler";
import {Methods} from "../../src/models/Methods";
import {Resources} from "../../src/models/Resources";
import {NotFoundException} from "../../src/exceptions/NotFoundException";
import {InputValidationException} from "../../src/exceptions/InputValidationException";


describe('MethodsHandler', () => {
    const handler = new MethodsHandler();

    const SequelizeMock = require('sequelize-mock');

    const DbConnectionMock = new SequelizeMock();

    const methods = {
            id: "0a55f9ea-5001-428c-a0f2-68c9cdbfab60",
            resourcesId: "353dd787-c746-42c7-aa9e-50d0e72998d4",
            method: "GET",
            authType: "none",
            contentType: "application/json",
            denyUpload: true,
            active: true,
            limit: "1mb",
            integrationType: "MOCK",
            forwardedMethod: "GET",
            endpointUrl: "",
            endpointProtocol: "https",
            contentHandling: "Passthrough",
            timeout: 29000,
            mockResponseBody: "{\"description\": \"Sample description for crm-test\"}",
            mockResponseCode: 200,
            mockResponseContent: "application/json",
        createdAt: "2020-01-14T11:55:23.000Z",
        updatedAt: "2020-01-14T11:55:23.000Z",
        resource: {
            id: "353dd787-c746-42c7-aa9e-50d0e72998d4",
            namespacesId: "7de17ec5-a297-4ce5-8c6a-842d3b48118d",
            resourcesId: null,
            path: "",
            createdAt: "2020-01-14T11:55:23.000Z",
            updatedAt: "2020-01-14T11:55:23.000Z"
        }
    };

    const method = {
        resourcesId: "353dd787-c746-42c7-aa9e-50d0e72998d4",
        method: "GET",
        authType: "none",
        contentType: "application/json",
        denyUpload: true,
        active: true,
        limit: "1mb",
        integrationType: "MOCK",
        forwardedMethod: "GET",
        endpointUrl: "",
        endpointProtocol: "https",
        contentHandling: "Passthrough",
        timeout: 29000,
        mockResponseBody: "{\"description\": \"Sample description for crm-test\"}",
        mockResponseCode: 200,
        mockResponseContent: "application/json"
    };

    const methodHttp = {
        resourcesId: "353dd787-c746-42c7-aa9e-50d0e72998d4",
        method: "GET",
        authType: "none",
        contentType: "application/json",
        denyUpload: true,
        active: true,
        limit: "1mb",
        integrationType: "HTTP",
        forwardedMethod: "GET",
        endpointUrl: "eqs.intra",
        endpointProtocol: "https",
        contentHandling: "Passthrough",
        timeout: 29000,
        mockResponseBody: "{\"description\": \"Sample description for crm-test\"}",
        mockResponseCode: 200,
        mockResponseContent: "application/json"
    };

    const methodsMock = DbConnectionMock.define('Methods', methods);

    beforeEach(async () => {


    });

    it("Should get all methods", async () => {
        const spyOnMethodsFindAll = spyOn<any>(Methods, 'findAll');
        spyOnMethodsFindAll.and.callFake(async () => {
            const apiList = await methodsMock.findAll();
            return apiList[0].dataValues;
        });

        const list = await handler.getAll();
        expect(await spyOnMethodsFindAll).toHaveBeenCalled();
        expect(list.id).toEqual(methods.id);
        expect(list.resource).toEqual(methods.resource);
        expect(list.resourcesId).toEqual(methods.resourcesId);
        expect(list.method).toEqual(methods.method);
        expect(list.authType).toEqual(methods.authType);
        expect(list.contentType).toEqual(methods.contentType);
        expect(list.denyUpload).toEqual(methods.denyUpload);
        expect(list.active).toEqual(methods.active);
        expect(list.limit).toEqual(methods.limit);
        expect(list.integrationType).toEqual(methods.integrationType);
        expect(list.forwardedMethod).toEqual(methods.forwardedMethod);
        expect(list.endpointUrl).toEqual(methods.endpointUrl);
        expect(list.endpointProtocol).toEqual(methods.endpointProtocol);
        expect(list.contentHandling).toEqual(methods.contentHandling);
        expect(list.timeout).toEqual(methods.timeout);
        expect(list.mockResponseBody).toEqual(methods.mockResponseBody);
        expect(list.mockResponseCode).toEqual(methods.mockResponseCode);
        expect(list.mockResponseContent).toEqual(methods.mockResponseContent);
        expect(Object.keys(list)).toContain('createdAt');
        expect(Object.keys(list)).toContain('updatedAt');
    });

    it("Should delete a method by ID", async () => {

        const spyOnMethodDeleteById = spyOn<any>(Methods, 'destroy');
        spyOnMethodDeleteById.and.callFake(async () => {
            return methodsMock.destroy({where: {id: "0a55f9ea-5001-428c-a0f2-68c9cdbfab60"}});
        });

        await handler.deleteOne("0a55f9ea-5001-428c-a0f2-68c9cdbfab60", "url");
        expect(await spyOnMethodDeleteById).toHaveBeenCalled();
    });

    it("Should return method by ID", async () => {

        const spyOnMethodFindById = spyOn<any>(Methods, 'findByPk');
        spyOnMethodFindById.and.callFake(async () => {
            return methodsMock.findById("0a55f9ea-5001-428c-a0f2-68c9cdbfab60", {include: [Resources]});
        });

        const list = await handler.getById("0a55f9ea-5001-428c-a0f2-68c9cdbfab60", "url");
        expect(await spyOnMethodFindById).toHaveBeenCalled();
        expect(list.id).toEqual(methods.id);
        expect(list.resource).toEqual(methods.resource);
        expect(list.resourcesId).toEqual(methods.resourcesId);
        expect(list.method).toEqual(methods.method);
        expect(list.authType).toEqual(methods.authType);
        expect(list.contentType).toEqual(methods.contentType);
        expect(list.denyUpload).toEqual(methods.denyUpload);
        expect(list.active).toEqual(methods.active);
        expect(list.limit).toEqual(methods.limit);
        expect(list.integrationType).toEqual(methods.integrationType);
        expect(list.forwardedMethod).toEqual(methods.forwardedMethod);
        expect(list.endpointUrl).toEqual(methods.endpointUrl);
        expect(list.endpointProtocol).toEqual(methods.endpointProtocol);
        expect(list.contentHandling).toEqual(methods.contentHandling);
        expect(list.timeout).toEqual(methods.timeout);
        expect(list.mockResponseBody).toEqual(methods.mockResponseBody);
        expect(list.mockResponseCode).toEqual(methods.mockResponseCode);
        expect(list.mockResponseContent).toEqual(methods.mockResponseContent);
    });

    it("Should throw not found exception if not found id", async () => {

        const spyOnMethodFindById = spyOn<any>(Methods, 'findByPk');
        spyOnMethodFindById.and.callFake(async () => {
            return methodsMock.findById("004a3bb1-f215-44bb-ae5a-04f1139ed22d", {include: [Resources]}).thenReturn(null);
        });
        handler.getById("004a3bb1-f215-44bb-ae5a-04f1139ed22d", "url").then(t => {
            expect(spyOnMethodFindById).toHaveBeenCalled();
        }).catch(k => {
            expect(k instanceof NotFoundException).toBeTruthy();
        });
    });

    it("Should throw error if resource didn't exist", async () => {

        const spyOnTestNotExistResource = spyOn<any>(Resources, 'count');
        spyOnTestNotExistResource.and.callFake(async () => {
            return 0;
        });

        await handler
            .addOrUpdate({resourcesId: "0a55f9ea-5001-428c-a0f2-68c9cdbfab60"}, "url")
            .then(t => {
                expect(spyOnTestNotExistResource).toHaveBeenCalled();
            }).catch(k => {
                expect(k instanceof NotFoundException).toBeTruthy();
            });
    });

    it("Should throw error if fetched data return null", async () => {

        const spyOnTestExistResource = spyOn<any>(Resources, 'count');
        spyOnTestExistResource.and.callFake(async () => {
            return 1;
        });

        const spyOnTestNotUniqueMethod = spyOn<any>(Methods, 'count');
        spyOnTestNotUniqueMethod.and.callFake(async () => {
            return 1;
        });

        await handler
            .addOrUpdate({resourcesId: "0a55f9ea-5001-428c-a0f2-68c9cdbfab60"}, "url")
            .then(t => {
                expect(spyOnTestExistResource).toHaveBeenCalledWith("0a55f9ea-5001-428c-a0f2-68c9cdbfab60");
                expect(spyOnTestNotUniqueMethod).toHaveBeenCalledWith(
                    'GET',
                    "0a55f9ea-5001-428c-a0f2-68c9cdbfab60"
                );
            }).catch(k => {
                expect(k instanceof InputValidationException).toBeTruthy();
            });
    });

    it("Should throw error if invalid endpoint url provided", async () => {

        const spyOnTestExistResource = spyOn<any>(Resources, 'count');
        spyOnTestExistResource.and.callFake(async () => {
            return 1;
        });

        const spyOnTestNotUniqueMethod = spyOn<any>(Methods, 'count');
        spyOnTestNotUniqueMethod.and.callFake(async () => {
            return 0;
        });

        await handler
            .addOrUpdate(
                {
                    resourcesId: "0a55f9ea-5001-428c-a0f2-68c9cdbfab60",
                    integrationType: "HTTP",
                    endpointUrl: "wrongUrl"
                },
                "url"
            )
            .then(t => {
                expect(spyOnTestExistResource).toHaveBeenCalledWith("0a55f9ea-5001-428c-a0f2-68c9cdbfab60");
                expect(spyOnTestNotUniqueMethod).toHaveBeenCalledWith(
                    'GET',
                    "0a55f9ea-5001-428c-a0f2-68c9cdbfab60"
                );
            }).catch(k => {
                expect(k instanceof InputValidationException).toBeTruthy();
            });
    });

    it("Should throw error if invalid mocked response json", async () => {

        const spyOnTestExistResource = spyOn<any>(Resources, 'count');
        spyOnTestExistResource.and.callFake(async () => {
            return 1;
        });

        const spyOnTestNotUniqueMethod = spyOn<any>(Methods, 'count');
        spyOnTestNotUniqueMethod.and.callFake(async () => {
            return 0;
        });

        await handler
            .addOrUpdate(
                {
                    resourcesId: "0a55f9ea-5001-428c-a0f2-68c9cdbfab60",
                    integrationType: "MOCK",
                    mockResponseBody: ""
                },
                "url"
            )
            .then(t => {
                expect(spyOnTestExistResource).toHaveBeenCalledWith("0a55f9ea-5001-428c-a0f2-68c9cdbfab60");
                expect(spyOnTestNotUniqueMethod).toHaveBeenCalledWith(
                    'GET',
                    "0a55f9ea-5001-428c-a0f2-68c9cdbfab60"
                );
            }).catch(k => {
                expect(k instanceof InputValidationException).toBeTruthy();
            });
    });

    it("Should insert new data but fail to extract", async () => {

        const spyOnTestExistResource = spyOn<any>(Resources, 'count');
        spyOnTestExistResource.and.callFake(async () => {
            return 1;
        });

        const spyOnTestNotUniqueMethod = spyOn<any>(Methods, 'count');
        spyOnTestNotUniqueMethod.and.callFake(async () => {
            return 0;
        });

        const spyOnMethodCreate = spyOn<any>(Methods, 'upsert');
        spyOnMethodCreate.and.callFake(async () => {
            return methodsMock.upsert(method);
        });

        const spyOnMethodFindById = spyOn<any>(Methods, 'findByPk');
        spyOnMethodFindById.and.callFake(async () => {
            return methodsMock.findById("0a55f9ea-5001-428c-a0f2-68c9cdbfab60").thenReturn(null);
        });


        await handler
            .addOrUpdate(
                method,
                "url"
            )
            .then(t => {
                expect(spyOnTestExistResource).toHaveBeenCalledWith(
                    {where: {id: '353dd787-c746-42c7-aa9e-50d0e72998d4'}}
                );
                expect(spyOnTestNotUniqueMethod).toHaveBeenCalledWith(
                    {where: {method: 'GET', resourcesId: '353dd787-c746-42c7-aa9e-50d0e72998d4'}}
                );
                expect(spyOnMethodCreate).toHaveBeenCalled();
                expect(spyOnMethodFindById).toHaveBeenCalled();
            }).catch(k => {
                expect(k instanceof NotFoundException).toBeTruthy();
            });
    });

    it("Should insert new data", async () => {

        const spyOnTestExistResource = spyOn<any>(Resources, 'count');
        spyOnTestExistResource.and.callFake(async () => {
            return 1;
        });

        const spyOnTestNotUniqueMethod = spyOn<any>(Methods, 'count');
        spyOnTestNotUniqueMethod.and.callFake(async () => {
            return 0;
        });

        const spyOnMethodCreate = spyOn<any>(Methods, 'upsert');
        spyOnMethodCreate.and.callFake(async () => {
            return methodsMock.upsert(method);
        });

        const spyOnMethodFindById = spyOn<any>(Methods, 'findByPk');
        spyOnMethodFindById.and.callFake(async () => {
            return methodsMock.findById("0a55f9ea-5001-428c-a0f2-68c9cdbfab60");
        });


        await handler
            .addOrUpdate(
                method,
                "url"
            )
            .then(t => {
                expect(spyOnTestExistResource).toHaveBeenCalledWith(
                    {where: {id: '353dd787-c746-42c7-aa9e-50d0e72998d4'}}
                );
                // expect(spyOnTestNotUniqueMethod).toHaveBeenCalledWith(
                //     { where: { method: 'GET', resourcesId: '353dd787-c746-42c7-aa9e-50d0e72998d4' }}
                // );
                expect(spyOnMethodCreate).toHaveBeenCalled();
                expect(spyOnMethodFindById).toHaveBeenCalled();
            });
    });

    it("Should insert new data with URL api", async () => {

        const spyOnTestExistResource = spyOn<any>(Resources, 'count');
        spyOnTestExistResource.and.callFake(async () => {
            return 1;
        });

        const spyOnTestNotUniqueMethod = spyOn<any>(Methods, 'count');
        spyOnTestNotUniqueMethod.and.callFake(async () => {
            return 0;
        });

        const spyOnMethodCreate = spyOn<any>(Methods, 'upsert');
        spyOnMethodCreate.and.callFake(async () => {
            return methodsMock.upsert(methodHttp);
        });

        const spyOnMethodFindById = spyOn<any>(Methods, 'findByPk');
        spyOnMethodFindById.and.callFake(async () => {
            return methodsMock.findById("0a55f9ea-5001-428c-a0f2-68c9cdbfab60");
        });


        await handler
            .addOrUpdate(
                methodHttp,
                "url"
            )
            .then(t => {
                expect(spyOnTestExistResource).toHaveBeenCalledWith(
                    {where: {id: '353dd787-c746-42c7-aa9e-50d0e72998d4'}}
                );
                // expect(spyOnTestNotUniqueMethod).toHaveBeenCalledWith(
                //     { where: { method: 'GET', resourcesId: '353dd787-c746-42c7-aa9e-50d0e72998d4' }}
                // );
                expect(spyOnMethodCreate).toHaveBeenCalled();
                expect(spyOnMethodFindById).toHaveBeenCalled();
            });
    });

    it('should throw Error when invalid uuid param passed', () => {

        handler.deleteOne('**********', 'url').then((t) => {
            expect(t).toThrow(new InputValidationException('Invalid ID: url'));
        }).catch(() => {
        });

        handler.addOrUpdate({resourcesId: '***********'}, 'url').then((t) => {
            expect(t).toThrow(new InputValidationException('Invalid resource ID: url'));
        }).catch(() => {
        });

        handler.getById('********', 'url').then((t) => {
            expect(t).toThrow(new InputValidationException('Invalid ID: url'));
        }).catch(() => {
        });
    });
});
