import {BelongsToMany, Column, CreatedAt, Model, PrimaryKey, Table, UpdatedAt} from "sequelize-typescript";
import {Strategies} from "./Strategies";
import {FeaturesStrategies} from "./FeaturesStrategies";

/**
 * @swagger
 *  components:
 *    schemas:
 *      Features:
 *        type: object
 *        required:
 *          - name
 *        properties:
 *          name:
 *            type: string
 *            description: Name of the feature.
 *          description:
 *            type: string
 *            description: small description
 *          enabled:
 *            type: boolean
 *            description: Feature is active or not.
 *        example:
 *           name: feature
 *           description: some description
 *           enabled: true
 */

@Table
export class Features extends Model<Features> {

    @PrimaryKey
    @Column
    id!: string;

    @Column
    name!: string;

    @Column
    description!: string;

    @Column
    enabled!: boolean;

    @BelongsToMany(() => Strategies, () => FeaturesStrategies, "features_id", "strategies_id")
    strategies!: Strategies[];

    @CreatedAt
    @Column
    createdAt!: Date;

    @UpdatedAt
    @Column
    updatedAt!: Date;
}
