import {NamespacesHandler} from "../../src/handlers/NamespacesHandler";
import {Namespaces} from "../../src/models/Namespaces";
import {Resources} from "../../src/models/Resources";
import {NotFoundException} from "../../src/exceptions/NotFoundException";
import {Methods} from "../../src/models/Methods";
import {InputValidationException} from "../../src/exceptions/InputValidationException";


describe('NamespacesHandler', () => {
    const handler = new NamespacesHandler();

    const SequelizeMock = require('sequelize-mock');

    const DbConnectionMock = new SequelizeMock();

    const namespaces = {
        id: "09ba15ba-bd05-414a-9b36-5e1f1b4178ce",
        route: "test",
        type: "REST",
        description: "Sample Namespace",
        active: true,
        createdAt: "2019-10-15T15:17:24.000Z",
        updatedAt: "2019-10-15T15:17:24.000Z"
    };

    const resourceMethods = [
        {
            id: "00e83fdf-80af-4981-bc3e-c5bf00e688b5",
            namespacesId: "09ba15ba-bd05-414a-9b36-5e1f1b4178ce",
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
                    }
                ]
        }
    ];

    const namespacesMock = DbConnectionMock.define('Namespaces', namespaces);

    const resourcesMethodsMock = DbConnectionMock.define('Resources', resourceMethods);

    it("Should get all namespaces", async () => {
        const spyOnResourcesFindAll = spyOn<any>(Namespaces, 'findAll');
        spyOnResourcesFindAll.and.callFake(async () => {
            const apiList = await namespacesMock.findAll();
            return apiList[0].dataValues;
        });

        const list = await handler.getAll();
        expect(await spyOnResourcesFindAll).toHaveBeenCalled();
        expect(list.id).toEqual(namespaces.id);
        expect(list.route).toEqual(namespaces.route);
        expect(list.type).toEqual(namespaces.type);
        expect(list.description).toEqual(namespaces.description);
        expect(list.active).toEqual(namespaces.active);
        expect(Object.keys(list)).toContain('createdAt');
        expect(Object.keys(list)).toContain('updatedAt');

    });

    it("Should return namepspace by ID", async () => {

        const spyOnNamepsaceFindById = spyOn<any>(Namespaces, 'findByPk');
        spyOnNamepsaceFindById.and.callFake(async () => {
            return namespacesMock.findById("09ba15ba-bd05-414a-9b36-5e1f1b4178ce", {include: [Resources]});
        });

        const list = await handler.getById("00e83fdf-80af-4981-bc3e-c5bf00e688b5", "url");
        expect(await spyOnNamepsaceFindById).toHaveBeenCalled();
        expect(list.id).toEqual(namespaces.id);
        expect(list.route).toEqual(namespaces.route);
        expect(list.type).toEqual(namespaces.type);
        expect(list.description).toEqual(namespaces.description);
        expect(list.active).toEqual(namespaces.active);
    });

    it("Should throw not found exception if not found namespace by id", async () => {

        const spyOnNamepsaceFindById = spyOn<any>(Namespaces, 'findByPk');
        spyOnNamepsaceFindById.and.callFake(async () => {
            return namespacesMock.findById("09ba15ba-bd05-414a-9b36-5e1f1b4178ce", {include: [Resources]}).thenReturn(null);
        });

        handler.getById("00e83fdf-80af-4981-bc3e-c5bf00e688b5", "url")
            .then(t => {
                expect(spyOnNamepsaceFindById).toHaveBeenCalled();
            })
            .catch(k => {
                expect(k instanceof NotFoundException).toBeTruthy();
            });
    });

    it("Should delete a namespace by ID", async () => {

        const spyOnNamespaceDeleteById = spyOn<any>(Namespaces, 'destroy');
        spyOnNamespaceDeleteById.and.callFake(async () => {
            return namespacesMock.destroy({where: {id: "c3d8ea3b-47e3-48b6-b5f0-f7c78ad36e1c"}});
        });

        await handler.deleteOne("00e83fdf-80af-4981-bc3e-c5bf00e688b5", "url");
        expect(await spyOnNamespaceDeleteById).toHaveBeenCalled();
    });

    it("Should delete a namespace by ID recursive", async () => {

        const spyOnFindAllResources = spyOn<any>(Resources, 'findAll');
        spyOnFindAllResources.and.callFake(async () => {
            return resourcesMethodsMock.findAll({
                where: {namespacesId: "09ba15ba-bd05-414a-9b36-5e1f1b4178ce"},
                include: [Methods],
            }).thenReturn(resourceMethods);
        });

        const spyOnMethodDeleteById = spyOn<any>(Methods, 'destroy');
        spyOnMethodDeleteById.and.callFake(async () => {
            return true;
        });

        const spyOnResourceDeleteById = spyOn<any>(Resources, 'destroy');
        spyOnResourceDeleteById.and.callFake(async () => {
            return true;
        });

        const spyOnNamespaceDeleteById = spyOn<any>(Namespaces, 'destroy');
        spyOnNamespaceDeleteById.and.callFake(async () => {
            return namespacesMock.destroy({where: {id: "c3d8ea3b-47e3-48b6-b5f0-f7c78ad36e1c"}});
        });

        await handler.deleteRecursiveOne("00e83fdf-80af-4981-bc3e-c5bf00e688b5", "url");

        expect(await spyOnFindAllResources).toHaveBeenCalled();

        resourceMethods[0].methods.forEach((element: any) => {
            expect(spyOnMethodDeleteById).toHaveBeenCalled();
        });

        expect(await spyOnResourceDeleteById).toHaveBeenCalled();
        expect(await spyOnNamespaceDeleteById).toHaveBeenCalled();
    });

    it("Should throw Input Validation exception if not unique namespace", async () => {

        const spyOnNamespaceUnique = spyOn<any>(NamespacesHandler, 'uniqueRoute');
        spyOnNamespaceUnique.and.callFake(async () => {
            return false;
        });

        handler.addOrUpdate({route: 'route'}, "url")
            .then(t => {
                expect(spyOnNamespaceUnique).toHaveBeenCalled();
            })
            .catch(k => {
                expect(k instanceof InputValidationException).toBeTruthy();
            });
    });

    it("Should throw invalid error if route is empty", async () => {

        const spyOnNamespaceUnique = spyOn<any>(NamespacesHandler, 'uniqueRoute');
        spyOnNamespaceUnique.and.callFake(async () => {
            return true;
        });

        handler.addOrUpdate({route: '/'}, "url")
            .then(t => {
                expect(spyOnNamespaceUnique).toHaveBeenCalled();
            })
            .catch(k => {
                expect(k instanceof InputValidationException).toBeTruthy();
            });
    });

    it('should throw Error when invalid uuid param passed', () => {

        handler.deleteOne('**********', 'url').then((t) => {
            expect(t).toThrow(new InputValidationException('Invalid ID: url'));
        }).catch(() => {
        });

        handler.deleteRecursiveOne('**********', 'url').then((t) => {
            expect(t).toThrow(new InputValidationException('Invalid ID: url'));
        }).catch(() => {
        });

        handler.getById('********', 'url').then((t) => {
            expect(t).toThrow(new InputValidationException('Invalid ID: url'));
        }).catch(() => {
        });

        handler.buildRoute('********', 'url').then((t) => {
            expect(t).toThrow(new InputValidationException('Invalid ID: url'));
        }).catch(() => {
        });

        handler.addOrUpdate({id: '********', route: 'route'}, 'url').then((t) => {
            expect(t).toThrow(new InputValidationException('Invalid ID: url'));
        }).catch(() => {
        });

        handler.addOrUpdate({id: '00e83fdf-80af-4981-bc3e-c5bf00e688b5', route: '/'}, 'url').then((t) => {
            expect(t).toThrow(new InputValidationException('Invalid namespace'));
        }).catch(() => {
        });
    });
});
