import {BelongsTo, Column, CreatedAt, DataType, ForeignKey, Model, PrimaryKey, Table, UpdatedAt} from "sequelize-typescript";
import {Resources} from "./Resources";

/**
 * @swagger
 *  components:
 *    schemas:
 *      Methods:
 *        type: object
 *        required:
 *          - resourcesId
 *          - method
 *          - authType
 *          - contentType
 *          - denyUpload
 *          - active
 *          - limit
 *          - integrationType
 *          - forwardedMethod
 *          - endpointProtocol
 *          - contentHandling
 *          - timeout
 *        properties:
 *          resourcesId:
 *            type: string
 *            description: ID of parent resource route.
 *          method:
 *            type: string
 *            description: any of HTTP methods
 *          authType:
 *            type: string
 *            description: type of auth jwt/public/apiKey
 *          contentType:
 *            type: string
 *            description: expected format of incoming request
 *          denyUpload:
 *            type: boolean
 *            description: accept or deny file upload
 *          active:
 *            type: boolean
 *            description: An active/inactive method
 *          limit:
 *            type: string
 *            description: limit of parsed json
 *          integrationType:
 *            type: string
 *            description: mock response or forward http
 *          forwardedMethod:
 *            type: string
 *            description: any of HTTP methods. Could be used to make transformation of request
 *          endPointUrl:
 *            type: string
 *            description: full route to forward request to
 *          endpointProtocol:
 *            type: string
 *            description: http or https
 *          contentHandling:
 *            type: string
 *            description: If transformation to be applied to payload. currently only Pass-through
 *          timeout:
 *            type: string
 *            description: timout to respond to requesting call
 *          mockResponseBody:
 *            type: string
 *            description: mocked body of response
 *          mockResponseCode:
 *            type: string
 *            description: mocked http code of response
 *          mockResponseContent:
 *            type: string
 *            description: mocked type of response
 *        example:
 *          resourcesId: 184b58e4-2ef3-40df-a904-022e945602ee
 *          method: GET
 *          authType: jwt
 *          contentType: application/json
 *          denyUpload: true
 *          active: true
 *          limit: 1mb
 *          integrationType: MOCK
 *          forwardedMethod: GET
 *          endpointUrl: ""
 *          endpointProtocol: https
 *          mockResponseBody: "{}"
 *          mockResponseCode: 200
 *          mockResponseContent: application/json
 */

@Table
export class Methods extends Model<Methods> {

    @PrimaryKey
    @Column
    id!: string;

    @ForeignKey(() => Resources)
    @Column
    resourcesId!: string;

    @BelongsTo(() => Resources, {onDelete: 'CASCADE', onUpdate: 'CASCADE', hooks: true})
    resource!: Resources;

    @Column
    method!: string;

    @Column
    authType!: string;

    @Column
    contentType!: string;

    @Column
    denyUpload!: boolean;

    @Column
    active!: boolean;

    @Column
    limit!: string;

    @Column
    integrationType!: string;

    @Column
    forwardedMethod!: string;

    @Column
    endpointUrl!: string;

    @Column
    endpointProtocol!: string;

    @Column
    contentHandling!: string;

    @Column
    timeout!: number;

    @Column(DataType.TEXT)
    mockResponseBody!: string;

    @Column
    mockResponseCode!: number;

    @Column
    mockResponseContent!: string;

    @CreatedAt
    @Column
    createdAt!: Date;

    @UpdatedAt
    @Column
    updatedAt!: Date;
}
