import {PrimaryKey, Column, CreatedAt, Model, Table, UpdatedAt, IsUUID, Unique} from "sequelize-typescript";

@Table
export class User extends Model<User> {

    @IsUUID(4)
    @PrimaryKey
    @Column
    id!: string;

    @Column
    displayName!: string;

    @Unique
    @Column
    username!: string;

    @Column
    photo!: string;

    @Column
    githubId!: string;

    @CreatedAt
    @Column
    createdAt!: Date;

    @UpdatedAt
    @Column
    updatedAt!: Date;
}
