import {BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table} from "sequelize-typescript";
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
 *          - parameters
 *        properties:
 *          features_id:
 *            type: string
 *            description: ID of the feature.
 *          strategies_id:
 *            type: string
 *            description: ID of strategy
 *          parameters:
 *            type: string
 *            description: List of values of the strategy
 *        example:
 *           features_id: ""
 *           strategies_id: ""
 *           parameters: "{}"
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

    @Column(DataType.TEXT)
    get parameters(): string {
        return JSON.parse(this.getDataValue('parameters'));
    }

    set parameters(value: string) {
        this.setDataValue('parameters', value);
    }
}
