import {Column, HasMany, Model, PrimaryKey, Table} from "sequelize-typescript";
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
}
