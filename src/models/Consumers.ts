import {PrimaryKey, Column, CreatedAt, Model, Table, UpdatedAt, HasMany} from "sequelize-typescript";
import {Keys} from "./Keys";

@Table
export class Consumers extends Model<Consumers> {

    @PrimaryKey
    @Column
    id!: string;

    @Column
    username!: string;

    @Column
    email!: string;

    @Column
    customId!: string;

    @Column
    active!: boolean;

    @HasMany(() => Keys)
    keys!: Keys[];

    @CreatedAt
    @Column
    createdAt!: Date;

    @UpdatedAt
    @Column
    updatedAt!: Date;
}
