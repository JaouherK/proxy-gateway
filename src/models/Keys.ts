import {PrimaryKey, Column, CreatedAt, Model, Table, UpdatedAt, ForeignKey} from "sequelize-typescript";
import {Consumers} from "./Consumers";

@Table
export class Keys extends Model<Keys> {

    @PrimaryKey
    @Column
    id!: string;

    @Column
    keyHash!: string;

    @Column
    keyPrefix!: string;

    @Column
    name!: string;

    @Column
    throttling!: boolean;

    @Column
    throttlingRate!: number;

    @Column
    throttlingBurst!: number;

    @Column
    quota!: boolean;

    @Column
    quotaRate!: number;

    @Column
    quotaPeriod!: number;

    @Column
    activeFrom!: Date;

    @Column
    activeTo!: Date;

    @Column
    active!: boolean;

    @ForeignKey(() => Consumers)
    @Column
    consumerId!: string;

    @CreatedAt
    @Column
    createdAt!: Date;

    @UpdatedAt
    @Column
    updatedAt!: Date;
}
