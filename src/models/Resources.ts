import {PrimaryKey, Column, CreatedAt, Model, Table, UpdatedAt, ForeignKey, BelongsTo, HasMany} from "sequelize-typescript";
import {Namespaces} from "./Namespaces";
import {Methods} from "./Methods";

@Table
export class Resources extends Model<Resources> {

    @PrimaryKey
    @Column
    id!: string;

    @ForeignKey(() => Namespaces)
    @Column
    namespacesId!: string;

    @BelongsTo(() => Namespaces)
    namespace!: Namespaces;

    @ForeignKey(() => Resources)
    @Column
    resourcesId!: string;

    @Column
    path!: string;

    @HasMany(() => Methods)
    methods!: Methods[];

    @HasMany(() => Resources)
    childResources!: Resources[];

    @CreatedAt
    @Column
    createdAt!: Date;

    @UpdatedAt
    @Column
    updatedAt!: Date;
}
