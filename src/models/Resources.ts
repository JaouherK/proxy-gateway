import {BelongsTo, Column, CreatedAt, ForeignKey, HasMany, Model, PrimaryKey, Table, UpdatedAt} from "sequelize-typescript";
import {Namespaces} from "./Namespaces";
import {Methods} from "./Methods";

/**
 * @swagger
 *  components:
 *    schemas:
 *      Resources:
 *        type: object
 *        required:
 *          - namespacesId
 *        properties:
 *          namespacesId:
 *            type: string
 *            description: ID of Base route of the whole.
 *          resourcesId:
 *            type: string
 *            description: Possible ID value of parent resource, null if first element.
 *          path:
 *            type: string
 *            description: Path of the route.
 *        example:
 *           namespacesId: 21249527-5051-4308-a747-298ebcf3f8d5
 *           resourcesId: null
 *           path: element
 */

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
