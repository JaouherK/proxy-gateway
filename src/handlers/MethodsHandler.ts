import {Methods} from "../models/Methods";
import {Resources} from "../models/Resources";
import {MethodsDomains, SupportedContentTypes, SupportedMethods} from "../domains/MethodsDomains";
import {InputValidationException} from "../exceptions/InputValidationException";
import {NotFoundException} from "../exceptions/NotFoundException";
import validator from "validator";

const {Op} = require("sequelize");

export class MethodsHandler {

    /**
     * get all Methods
     * @return {any}
     */
    public async getAll(): Promise<any> {
        return Methods.findAll({include: [Resources]});
    }

    /**
     * delete a method
     * @param  {string} id uuid v4 format
     * @param url
     * @return {any}
     */
    public async deleteOne(id: string, url: string): Promise<any> {
        if (!validator.isUUID(id)) {
            throw new InputValidationException('Invalid ID: ' + url);
        }
        return Methods.destroy({where: {id}});
    }

    /**
     * add/update method
     * @return {any}
     * @param apiData
     * @param url
     */
    public async addOrUpdate(apiData: any, url: string): Promise<any> {

        if (!validator.isUUID(apiData.resourcesId)) {
            throw new InputValidationException('Invalid resource ID: ' + url);
        }

        if (!(await this.existResource(apiData.resourcesId))) {
            throw new NotFoundException('Resource not found: ' + url);
        }

        apiData.method = (apiData.method !== undefined) ? apiData.method : SupportedMethods.get;

        if (!apiData.hasOwnProperty("id")) {
            if (!(await this.uniqueMethod(apiData.method, apiData.resourcesId))) {
                throw new InputValidationException('Method already exists for current resource');
            }
            const uuid = require('uuid-v4');
            apiData.id = uuid();
        }

        // todo: have a check of duplicate when an existing created method so won't take place of another existing

        if (apiData.integrationType === 'MOCK') {
            if (!validator.isJSON(apiData.mockResponseBody)) {
                throw new InputValidationException('Invalid JSON mocked response');
            }
            apiData.mockResponseBody = (apiData.mockResponseBody !== '') ? apiData.mockResponseBody : '{}';
            apiData.mockResponseCode = (apiData.mockResponseCode !== '') ? apiData.mockResponseCode : 200;
            apiData.mockResponseContent = (apiData.mockResponseContent !== '') ?
                apiData.mockResponseContent : SupportedContentTypes.json;
        }

        if ((apiData.endpointUrl !== '') || (apiData.integrationType === 'HTTP')) {
            if (!validator.isURL(apiData.endpointUrl)) {
                throw new InputValidationException('Invalid endpoint URL ' + url);
            }
        }

        await Methods.upsert(
            new MethodsDomains(
                apiData.resourcesId,
                apiData.id,
                apiData.method,
                apiData.authType,
                apiData.contentType,
                apiData.denyUpload,
                apiData.limit,
                apiData.integrationType,
                apiData.forwardedMethod,
                apiData.endpointUrl,
                apiData.endpointProtocol,
                apiData.contentHandling,
                apiData.timeout,
                apiData.mockResponseBody,
                apiData.mockResponseCode,
                apiData.mockResponseContent,
                apiData.active,
            )
        );
        const response = await Methods.findByPk(apiData.id);
        if (response === null) {
            throw new NotFoundException("An error occurred. Method not found");
        }
        return response;
    }

    /**
     * get method by ID
     * @param  {string} id  uuid v4 format
     * @param url
     * @return {any}
     */
    public async getById(id: string, url: string): Promise<any> {

        if (!validator.isUUID(id)) {
            throw new InputValidationException('Invalid ID: ' + url);
        }
        const response = await Methods.findByPk(id, {include: [Resources]});
        if (response === null) {
            throw new NotFoundException("Method not found");
        }
        return response;
    }

    /**
     * Check if a resource exists
     * @access  private
     * @param  {string} resourceId
     * @return {boolean}
     */
    private async existResource(resourceId: string): Promise<boolean> {
        const counter = await Resources.count({where: {'id': resourceId}});
        return (counter !== 0);
    }

    /**
     * Check if a method already exists for current resource id
     * @access  private
     * @param  {string} method
     * @param  {string} resourcesId
     * @return {boolean}
     */
    private async uniqueMethod(method: string, resourcesId: string): Promise<boolean> {
        const counter = await Methods.count(
            {
                where: {
                    [Op.and]: [
                        {'method': method},
                        {'resourcesId': resourcesId}
                    ]
                }
            }
        );
        return (counter === 0);
    }
}
