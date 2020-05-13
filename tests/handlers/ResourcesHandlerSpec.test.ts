import {ResourcesHandler} from "../../src/handlers/ResourcesHandler";
import {Resources} from "../../src/models/Resources";
import {Methods} from "../../src/models/Methods";
import {NotFoundException} from "../../src/exceptions/NotFoundException";
import {Namespaces} from "../../src/models/Namespaces";
import {InputValidationException} from "../../src/exceptions/InputValidationException";


describe('ResourcesHandler', () => {
    const handler = new ResourcesHandler();

    const SequelizeMock = require('sequelize-mock');

    const DbConnectionMock = new SequelizeMock();

    const resources = {
        namespacesId: "46d1d88d-4803-4461-8b45-89d0748c5c60",
        id: "00e83fdf-80af-4981-bc3e-c5bf00e688b5",
        resourcesId: "9edc192b-bacc-485a-8356-8b84b28c60f0",
        path: "crimsom",
        resources: [
            {
                id: "21e595f7-ec68-4be9-a7e8-1f45a57314ae",
                resourcesId: "00e83fdf-80af-4981-bc3e-c5bf00e688b5",
                method: "GET",
                authType: "jwt",
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
                mockResponseBody: "{}",
                mockResponseCode: "200",
                mockResponseContent: "application/json",
            }
        ],
        childResources: []
    };

    const resource = {
        id: "00e83fdf-80af-4981-bc3e-c5bf00e688b5",
        namespacesId: "46d1d88d-4803-4461-8b45-89d0748c5c60",
        resourcesId: "9edc192b-bacc-485a-8356-8b84b28c60f0",
        path: "crimsom",
    };

    const resourceMethods = [
        {
            id: "00e83fdf-80af-4981-bc3e-c5bf00e688b5",
            namespacesId: "46d1d88d-4803-4461-8b45-89d0748c5c60",
            resourcesId: null,
            path: "crimsom",
            childResources: [],
            methods:
                [
                    {
                        id: '21e595f7-ec68-4be9-a7e8-1f45a57314af',
                        resourcesId: '00e83fdf-80af-4981-bc3e-c5bf00e688b5',
                        method: 'POST',
                        authType: 'jwt',
                        contentType: 'application/json',
                        denyUpload: true,
                        active: true,
                        limit: '1mb',
                        integrationType: 'MOCK',
                        forwardedMethod: 'POST',
                        endpointUrl: '',
                        endpointProtocol: 'https',
                        contentHandling: 'Passthrough',
                        timeout: 29000,
                        mockResponseBody: '{}',
                        mockResponseCode: '200',
                        mockResponseContent: 'application/json',
                    },
                    {
                        id: '21e595f7-ec68-4be9-a7e8-1f45a57314ae',
                        resourcesId: '00e83fdf-80af-4981-bc3e-c5bf00e688b5',
                        method: 'GET',
                        authType: 'jwt',
                        contentType: 'application/json',
                        denyUpload: true,
                        active: true,
                        limit: '1mb',
                        integrationType: 'MOCK',
                        forwardedMethod: 'GET',
                        endpointUrl: '',
                        endpointProtocol: 'https',
                        contentHandling: 'Passthrough',
                        timeout: 29000,
                        mockResponseBody: '{}',
                        mockResponseCode: '200',
                        mockResponseContent: 'application/json',
                    },
                    {
                        id: '23208144-f7f0-431a-9028-3521df138e68',
                        resourcesId: '00e83fdf-80af-4981-bc3e-c5bf00e688b5',
                        method: 'DELETE',
                        authType: 'jwt',
                        contentType: 'application/json',
                        denyUpload: true,
                        active: true,
                        limit: '1mb',
                        integrationType: 'MOCK',
                        forwardedMethod: 'DELETE',
                        endpointUrl: '',
                        endpointProtocol: 'https',
                        contentHandling: 'Passthrough',
                        timeout: 29000,
                        mockResponseBody: '{}',
                        mockResponseCode: '200',
                        mockResponseContent: 'application/json',
                    }
                ]
        },
        {
            namespacesId: "46d1d88d-4803-4461-8b45-89d0748c5c60",
            id: "5817d387-559a-4100-b82e-92529d16408e",
            resourcesId: "00e83fdf-80af-4981-bc3e-c5bf00e688b5",
            path: "Freinds",
            methods: [
                {
                    id: "b0fb482e-f9a3-4fb8-b24a-bf08a374bc55",
                    resourcesId: "5817d387-559a-4100-b82e-92529d16408e",
                    method: "GET",
                    authType: "jwt",
                    contentType: "application/json",
                    denyUpload: true,
                    active: true,
                    limit: "1mb",
                    integrationType: "HTTP",
                    forwardedMethod: "GET",
                    endpointUrl: "test.com",
                    endpointProtocol: "https",
                    contentHandling: "Passthrough",
                    timeout: 29000,
                    mockResponseBody: "",
                    mockResponseCode: "200",
                    mockResponseContent: "",
                }
            ],
            childResources: []
        }
    ];

    const resourcesMock = DbConnectionMock.define('Resources', resources);
    const resourcesMethodsMock = DbConnectionMock.define('Resources', resourceMethods);

    it("Should get all resources", async () => {
        const spyOnMethodsFindAll = spyOn<any>(Resources, 'findAll');
        spyOnMethodsFindAll.and.callFake(async () => {
            const apiList = await resourcesMock.findAll();
            return apiList[0].dataValues;
        });

        const list = await handler.getAll();
        expect(await spyOnMethodsFindAll).toHaveBeenCalled();
        expect(list.id).toEqual(resources.id);
        expect(list.namespacesId).toEqual(resources.namespacesId);
        expect(list.resourcesId).toEqual(resources.resourcesId);
        expect(list.path).toEqual(resources.path);
        expect(list.resources).toEqual(resources.resources);
        expect(list.childResources).toEqual(resources.childResources);
        expect(Object.keys(list)).toContain('createdAt');
        expect(Object.keys(list)).toContain('updatedAt');
    });

    it("Should delete a method by ID", async () => {

        const spyOnResourceDeleteById = spyOn<any>(Resources, 'destroy');
        spyOnResourceDeleteById.and.callFake(async () => {
            return resourcesMock.destroy({where: {id: "00e83fdf-80af-4981-bc3e-c5bf00e688b5"}});
        });

        await handler.deleteOne("00e83fdf-80af-4981-bc3e-c5bf00e688b5", "url");
        expect(await spyOnResourceDeleteById).toHaveBeenCalled();
    });

    it("Should should check if proxy exist by ID", async () => {

        const spyOnResourceDeleteById = spyOn<any>(Resources, 'destroy');
        spyOnResourceDeleteById.and.callFake(async () => {
            return resourcesMock.destroy({where: {id: "00e83fdf-80af-4981-bc3e-c5bf00e688b5"}});
        });

        await handler.deleteOne("00e83fdf-80af-4981-bc3e-c5bf00e688b5", "url");
        expect(await spyOnResourceDeleteById).toHaveBeenCalled();
    });

    it("Should return resource by ID", async () => {

        const spyOnMethodFindById = spyOn<any>(Resources, 'findByPk');
        spyOnMethodFindById.and.callFake(async () => {
            return resourcesMock.findById("00e83fdf-80af-4981-bc3e-c5bf00e688b5", {include: [Resources, Methods]});
        });

        const list = await handler.getById("00e83fdf-80af-4981-bc3e-c5bf00e688b5", "url");
        expect(await spyOnMethodFindById).toHaveBeenCalled();
        expect(list.id).toEqual(resources.id);
        expect(list.namespacesId).toEqual(resources.namespacesId);
        expect(list.resourcesId).toEqual(resources.resourcesId);
        expect(list.resources).toEqual(resources.resources);
    });

    it("Should return resource by ID", async () => {

        const spyOnMethodFindById = spyOn<any>(Resources, 'findByPk');
        spyOnMethodFindById.and.callFake(async () => {
            return resourcesMock.findById("00e83fdf-80af-4981-bc3e-c5bf00e688b5", {include: [Resources, Methods]});
        });

        const list = await handler.getById("00e83fdf-80af-4981-bc3e-c5bf00e688b5", "url");
        expect(await spyOnMethodFindById).toHaveBeenCalled();
        expect(list.id).toEqual(resources.id);
        expect(list.namespacesId).toEqual(resources.namespacesId);
        expect(list.resourcesId).toEqual(resources.resourcesId);
        expect(list.resources).toEqual(resources.resources);
    });

    it("Should throw not found exception if not found id", async () => {

        const spyOnMethodFindById = spyOn<any>(Resources, 'findByPk');
        spyOnMethodFindById.and.callFake(async () => {
            return resourcesMock.findById("00e83fdf-80af-4981-bc3e-c5bf00e688b5", {include: [Resources, Methods]}).thenReturn(null);
        });
        handler.getById("00e83fdf-80af-4981-bc3e-c5bf00e688b5", "url").then(t => {
            expect(spyOnMethodFindById).toHaveBeenCalled();
        }).catch(k => {
            expect(k instanceof NotFoundException).toBeTruthy();
        });
    });


    it("Should return method of a resource by ID", async () => {

        const spyOnMethodFindById = spyOn<any>(Resources, 'findByPk');
        spyOnMethodFindById.and.callFake(async () => {
            return resourcesMock.findById("00e83fdf-80af-4981-bc3e-c5bf00e688b5", {include: [Methods]});
        });

        const list = await handler.getByIdMethods("00e83fdf-80af-4981-bc3e-c5bf00e688b5", "url");
        expect(await spyOnMethodFindById).toHaveBeenCalled();
        expect(list.id).toEqual(resources.id);
        expect(list.namespacesId).toEqual(resources.namespacesId);
        expect(list.resourcesId).toEqual(resources.resourcesId);
        expect(list.resources).toEqual(resources.resources);
    });

    it("Should throw not found exception if not found id", async () => {

        const spyOnMethodFindById = spyOn<any>(Resources, 'findByPk');
        spyOnMethodFindById.and.callFake(async () => {
            return resourcesMock.findById("00e83fdf-80af-4981-bc3e-c5bf00e688b5", {include: [Methods]}).thenReturn(null);
        });
        handler.getByIdMethods("00e83fdf-80af-4981-bc3e-c5bf00e688b5", "url").then(t => {
            expect(spyOnMethodFindById).toHaveBeenCalled();
        }).catch(k => {
            expect(k instanceof NotFoundException).toBeTruthy();
        });
    });

    it("Should throw error if not existent namespace provided when upsert", async () => {

        const spyOnTestNotExistResource = spyOn<any>(Namespaces, 'count');
        spyOnTestNotExistResource.and.callFake(async () => {
            return 0;
        });

        await handler
            .addOrUpdate(
                {
                    namespacesId: "46d1d88d-4803-4461-8b45-89d0748c5c60",
                    path: 'path'
                },
                "url"
            )
            .then(t => {
                expect(spyOnTestNotExistResource).toHaveBeenCalled();
            }).catch(k => {
                expect(k instanceof NotFoundException).toBeTruthy();
            });
    });

    it("Should throw error if not unique resource provided when upsert", async () => {

        const spyOnTestExistNamespace = spyOn<any>(Namespaces, 'count');
        spyOnTestExistNamespace.and.callFake(async () => {
            return 1;
        });

        const spyOnTestNotUniqueMethod = spyOn<any>(Resources, 'count');
        spyOnTestNotUniqueMethod.and.callFake(async () => {
            return 1;
        });

        await handler
            .addOrUpdate(
                {
                    namespacesId: "46d1d88d-4803-4461-8b45-89d0748c5c60",
                    path: 'path'
                },
                "url"
            )
            .then(t => {
                expect(spyOnTestExistNamespace).toHaveBeenCalled();
                expect(spyOnTestNotUniqueMethod).toHaveBeenCalled();
            }).catch(k => {
                expect(k instanceof InputValidationException).toBeTruthy();
            });
    });


    it("Should throw error if empty path inserted when upsert", async () => {

        const spyOnTestExistNamespace = spyOn<any>(Namespaces, 'count');
        spyOnTestExistNamespace.and.callFake(async () => {
            return 1;
        });

        const spyOnTestNotUniqueResource = spyOn<any>(Resources, 'count');
        spyOnTestNotUniqueResource.and.callFake(async () => {
            return 0;
        });

        await handler
            .addOrUpdate(
                {
                    namespacesId: "46d1d88d-4803-4461-8b45-89d0748c5c60",
                    path: ''
                },
                "url"
            )
            .then(t => {
                expect(spyOnTestExistNamespace).toHaveBeenCalled();
                expect(spyOnTestNotUniqueResource).toHaveBeenCalled();
            }).catch(k => {
                expect(k instanceof InputValidationException).toBeTruthy();
            });
    });

    it("Should insert new data but fail to extract", async () => {

        const spyOnTestExistNamespace = spyOn<any>(Namespaces, 'count');
        spyOnTestExistNamespace.and.callFake(async () => {
            return 1;
        });

        const spyOnTestNotUniqueResource = spyOn<any>(Resources, 'count');
        spyOnTestNotUniqueResource.and.callFake(async () => {
            return 0;
        });

        const spyOnResourceCreate = spyOn<any>(Resources, 'upsert');
        spyOnResourceCreate.and.callFake(async () => {
            return resourcesMock.upsert(resource);
        });

        const spyOnResourceFindById = spyOn<any>(Resources, 'findByPk');
        spyOnResourceFindById.and.callFake(async () => {
            return resourcesMock.findById("00e83fdf-80af-4981-bc3e-c5bf00e688b5").thenReturn(null);
        });


        await handler
            .addOrUpdate(
                resource,
                "url"
            )
            .then(t => {
                expect(spyOnTestExistNamespace).toHaveBeenCalled();
                expect(spyOnTestNotUniqueResource).toHaveBeenCalled();
                expect(spyOnResourceCreate).toHaveBeenCalled();
                expect(spyOnResourceFindById).toHaveBeenCalled();
            }).catch(k => {
                expect(k instanceof NotFoundException).toBeTruthy();
            });
    });

    it("Should insert new data successfully", async () => {

        const spyOnTestExistNamespace = spyOn<any>(Namespaces, 'count');
        spyOnTestExistNamespace.and.callFake(async () => {
            return 1;
        });

        const spyOnTestNotUniqueResource = spyOn<any>(Resources, 'count');
        spyOnTestNotUniqueResource.and.callFake(async () => {
            return 0;
        });

        const spyOnResourceCreate = spyOn<any>(Resources, 'upsert');
        spyOnResourceCreate.and.callFake(async () => {
            return resourcesMock.upsert(resource);
        });

        const spyOnResourceFindById = spyOn<any>(Resources, 'findByPk');
        spyOnResourceFindById.and.callFake(async () => {
            return resourcesMock.findById("00e83fdf-80af-4981-bc3e-c5bf00e688b5");
        });

        await handler
            .addOrUpdate(
                {
                    namespacesId: "46d1d88d-4803-4461-8b45-89d0748c5c60",
                    resourcesId: "9edc192b-bacc-485a-8356-8b84b28c60f0",
                    path: "crimsom",
                },
                "url"
            )
            .then(t => {
                expect(spyOnTestExistNamespace).toHaveBeenCalled();
                expect(spyOnTestNotUniqueResource).toHaveBeenCalled();
                expect(spyOnResourceCreate).toHaveBeenCalled();
                expect(spyOnResourceFindById).toHaveBeenCalled();
            });
    });


    it("Should get tree by namespace id", async () => {

        const spyOnFindAllResources = spyOn<any>(Resources, 'findAll');
        spyOnFindAllResources.and.callFake(async () => {
            return resourcesMethodsMock.findAll({
                where: {namespacesId: "46d1d88d-4803-4461-8b45-89d0748c5c60"},
                include: [Methods],
            }).thenReturn(resourceMethods);
        });

        await handler
            .getTreeByNamespace(
                "46d1d88d-4803-4461-8b45-89d0748c5c60",
                "url"
            )
            .then(list => {
                // const util = require('util');
                // console.log(util.inspect(list, false, null, true /* enable colors */));

                expect(list[0].id).toEqual(resources.id);
                expect(list[0].namespacesId).toEqual(resources.namespacesId);
                expect(list[0].resourcesId).toEqual(null);
                expect(list[0].path).toEqual(resources.path);

            });
    });

    it('should throw Error when invalid uuid param passed', () => {

        handler.deleteOne('**********', 'url').then((t) => {
            expect(t).toThrow(new InputValidationException('Invalid ID: url'));
        }).catch(() => {
        });

        handler.addOrUpdate({namespacesId: '***********', path: '987'}, 'url')
            .then((t) => {
                expect(t).toThrow(new InputValidationException('Invalid resource ID: url'));
            }).catch(() => {
        });

        handler.getById('********', 'url').then((t) => {
            expect(t).toThrow(new InputValidationException('Invalid ID: url'));
        }).catch(() => {
        });

        handler.getTreeByNamespace('********', 'url').then((t) => {
            expect(t).toThrow(new InputValidationException('Invalid ID: url'));
        }).catch(() => {
        });

        handler.getByIdMethods('********', 'url').then((t) => {
            expect(t).toThrow(new InputValidationException('Invalid ID: url'));
        }).catch(() => {
        });
    });
});
