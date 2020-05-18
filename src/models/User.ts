import {Column, CreatedAt, IsUUID, Model, NotEmpty, PrimaryKey, Table, Unique, UpdatedAt} from "sequelize-typescript";

/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - username
 *          - password
 *          - role
 *        properties:
 *          username:
 *            type: string
 *          password:
 *            type: string
 *          role:
 *            type: string
 *            description: Role for the user.
 *        example:
 *           name: Alexander
 *           email: p@ssw0rd
 *           role: admin
 */

@Table
export class User extends Model<User> {

    @IsUUID(4)
    @PrimaryKey
    @Column
    id!: string;

    @Unique
    @Column
    username!: string;

    @Column
    password!: string;

    @NotEmpty
    @Column
    role!: string;

    @CreatedAt
    @Column
    createdAt!: Date;

    @UpdatedAt
    @Column
    updatedAt!: Date;
}
