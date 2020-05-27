import {BelongsToMany, Column, CreatedAt, DataType, IsUUID, Model, PrimaryKey, Table, Unique, UpdatedAt} from "sequelize-typescript";
import {Features} from "./Features";
import {FeaturesStrategies} from "./FeaturesStrategies";

/**
 * @swagger
 *  components:
 *    schemas:
 *      Strategies:
 *        type: object
 *        required:
 *          - name
 *        properties:
 *          name:
 *            type: string
 *            description: Name for strategy (included getter and setter)
 *          parameters:
 *            type: string
 *            description: List of parameters
 *        example:
 *           name: default
 *           parameters: {}
 */

@Table
export class Strategies extends Model<Strategies> {

    @IsUUID(4)
    @PrimaryKey
    @Column
    id!: string;

    @Unique
    @Column
    name!: string;
    @BelongsToMany(() => Features, () => FeaturesStrategies, "strategies_id", "features_id")
    features!: Features[];
    @CreatedAt
    @Column
    createdAt!: Date;
    @UpdatedAt
    @Column
    updatedAt!: Date;

    @Column(DataType.TEXT)
    get parameters(): string {
        return JSON.parse(this.getDataValue('parameters'));
    }

    set parameters(value: string) {
        this.setDataValue('parameters', value);
    }
}
