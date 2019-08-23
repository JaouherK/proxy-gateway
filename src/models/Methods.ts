import {PrimaryKey, Column, CreatedAt, Model, Table, UpdatedAt, ForeignKey, BelongsTo, DataType} from "sequelize-typescript";
import {Resources} from "./Resources";

@Table
export class Methods extends Model<Methods> {

    @PrimaryKey
    @Column
    id!: string;

    @ForeignKey(() => Resources)
    @Column
    resourcesId!: string;

    @BelongsTo(() => Resources)
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
    mockResponseCode!: string;

    @Column
    mockResponseContent!: string;

    @CreatedAt
    @Column
    createdAt!: Date;

    @UpdatedAt
    @Column
    updatedAt!: Date;
}
