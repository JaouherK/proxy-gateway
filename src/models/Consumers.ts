import {Column, HasMany, Model, PrimaryKey, Table} from "sequelize-typescript";
import {Keys} from "./Keys";

/**
 * @swagger
 *  components:
 *    schemas:
 *      Consumers:
 *        type: object
 *        required:
 *          - username
 *          - email
 *          - customId
 *          - active
 *        properties:
 *          username:
 *            type: string
 *            description: User name.
 *          email:
 *            type: email
 *            description: Email for user.
 *          customId:
 *            type: string
 *            description: Custom /ID.
 *          active:
 *            type: boolean
 *            description: consumer is active or not.
 *        example:
 *           username: test
 *           email: test@test.com
 *           customId: b5b741c8-44e2-4064-a8f0-82ed8cafac21
 *           active: true
 */
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
