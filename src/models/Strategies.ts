import {
    BelongsToMany,
    Column,
    CreatedAt,
    DataType,
    HasMany,
    IsUUID,
    Model,
    PrimaryKey,
    Table,
    Unique,
    UpdatedAt
} from "sequelize-typescript";
import {Features} from "./Features";
import {FeaturesStrategies} from "./FeaturesStrategies";
import {StratOptions} from "./StratOptions";

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

    @Column(DataType.TEXT)
    description!: string;

    @BelongsToMany(() => Features, () => FeaturesStrategies, "strategies_id", "features_id")
    features!: Features[];

    @HasMany(() => StratOptions)
    options!: StratOptions[];

    @CreatedAt
    @Column
    createdAt!: Date;
    @UpdatedAt
    @Column
    updatedAt!: Date;
}
