import {Column, CreatedAt, HasMany, Model, PrimaryKey, Table, UpdatedAt} from "sequelize-typescript";
import {Resources} from "./Resources";

/**
 * @swagger
 *  components:
 *    schemas:
 *      Namespaces:
 *        type: object
 *        required:
 *          - route
 *          - type
 *          - active
 *        properties:
 *          route:
 *            type: string
 *            description: Base route for the whole tree under it.
 *          type:
 *            type: string
 *            description: REST API or websocket.
 *          description:
 *            type: string
 *            description: Small description for the base route.
 *          active:
 *            type: boolean
 *            description: Base route is active or not.
 *        example:
 *           route: test
 *           type: REST
 *           description: Sample Namespace
 *           active: true
 */

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
