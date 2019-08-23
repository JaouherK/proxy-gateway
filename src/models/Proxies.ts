import {PrimaryKey, Column, CreatedAt, Model, Table, UpdatedAt, DataType} from "sequelize-typescript";

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
