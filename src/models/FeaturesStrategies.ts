import {BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table} from "sequelize-typescript";
import {Strategies} from "./Strategies";
import {Features} from "./Features";

/**
 * @swagger
 *  components:
 *    schemas:
 *      FeaturesStrategies:
 *        type: object
 *        required:
 *          - features_id
 *          - strategies_id
 *        properties:
 *          features_id:
 *            type: string
 *            description: ID of the feature.
 *          strategies_id:
 *            type: string
 *            description: ID of strategy
 *        example:
 *           features_id: ""
 *           strategies_id: ""
 */

@Table
export class FeaturesStrategies extends Model<FeaturesStrategies> {

    @BelongsTo(() => Features)
    features!: Features;

    @ForeignKey(() => Features)
    @PrimaryKey
    @Column
    features_id!: number;

    @BelongsTo(() => Strategies)
    strategies!: Strategies;

    @ForeignKey(() => Strategies)
    @PrimaryKey
    @Column
    strategies_id!: number;
}
