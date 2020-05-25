import {Column, CreatedAt, DataType, Model, PrimaryKey, Table, UpdatedAt} from "sequelize-typescript";

/**
 * @swagger
 *  components:
 *    schemas:
 *      Proxies:
 *        type: object
 *        required:
 *          - namespacesId
 *          - namespace
 *          - url
 *          - https
 *          - method
 *          - denyUpload
 *          - limit
 *          - authType
 *          - timeout
 *          - integrationType
 *          - order
 *        properties:
 *          namespacesId:
 *            type: string
 *            description: ID of Base route of the whole.
 *          namespace:
 *            type: string
 *            description: text of Base route of the whole.
 *          url:
 *            type: string
 *            description: full route to be parsed
 *          endpointUrl:
 *            type: string
 *            description: Url to forward request to
 *          https:
 *            type: boolean
 *            description: enable/disable https
 *          method:
 *            type: string
 *            description: any of HTTP methods
 *          denyUpload:
 *            type: boolean
 *            description: accept or deny file upload
 *          limit:
 *            type: number
 *            description: limit of parsed json
 *          authType:
 *            type: string
 *            description: type of auth jwt/public/apiKey
 *          timeout:
 *            type: string
 *            description: timout to respond to requesting call
 *          integrationType:
 *            type: string
 *            description: mock response or forward http
 *          mockResponseBody:
 *            type: string
 *            description: mocked body of response
 *          mockResponseCode:
 *            type: number
 *            description: mocked http code of response
 *          mockResponseContent:
 *            type: string
 *            description: mocked type of response
 *          order:
 *            type: number
 *            description: Order to be taken in consideration in proxies parsing
 *        example:
 *          namespacesId: 21249527-5051-4308-a747-298ebcf3f8d5
 *          namespace: test
 *          url: /test
 *          endpointUrl:
 *          https: true
 *          method: GET
 *          denyUpload: true
 *          limit: 1mb
 *          authType: jwt
 *          timeout: 29000
 *          integrationType: MOCK
 *          mockResponseBody: {"description": "Sample Namespace"}
 *          mockResponseCode: 200
 *          mockResponseContent: application/json
 *          order: 0
 */

@Table
export class Proxies extends Model<Proxies> {

    @PrimaryKey
    @Column
    id!: string;

    @Column
    namespacesId!: string;

    @Column
    namespace!: string;

    @Column
    url!: string;

    @Column
    endpointUrl!: string;

    @Column
    https!: boolean;

    @Column
    method!: string;

    @Column
    denyUpload!: boolean;

    @Column
    limit!: string;

    @Column
    authType!: string;

    @Column
    timeout!: number;

    @Column
    integrationType!: string;

    @Column(DataType.TEXT)
    mockResponseBody!: string;

    @Column
    mockResponseCode!: number;

    @Column
    mockResponseContent!: string;

    @Column
    order!: number;

    @CreatedAt
    @Column
    createdAt!: Date;

    @UpdatedAt
    @Column
    updatedAt!: Date;
}
