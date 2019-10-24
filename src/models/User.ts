import {PrimaryKey, Column, CreatedAt, Model, Table, UpdatedAt, IsUUID, Unique, NotEmpty} from "sequelize-typescript";

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
