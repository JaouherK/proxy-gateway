import {Column, CreatedAt, HasMany, Model, PrimaryKey, Table, UpdatedAt} from "sequelize-typescript";
import {Resources} from "./Resources";

@Table
export class Namespaces extends Model<Namespaces> {

    @PrimaryKey
    @Column
    id!: string;

    @Column
    route!: string;

    @Column
    type!: string;

    @Column
    description!: string;

    @Column
    active!: boolean;

    @HasMany(() => Resources, {onDelete: 'CASCADE', onUpdate: 'CASCADE', hooks: true})
    resources!: Resources[];

    @CreatedAt
    @Column
    createdAt!: Date;

    @UpdatedAt
    @Column
    updatedAt!: Date;
}
