import {BelongsTo, Column, CreatedAt, ForeignKey, Model, PrimaryKey, Table, UpdatedAt} from "sequelize-typescript";
import {Strategies} from "./Strategies";

/**
 * @swagger
 *  components:
 *    schemas:
 *      StratOptions:
 *        type: object
 *        required:
 *          - strategyId
 *          - name
 *          - type
 *          - required
 *        properties:
 *          strategyId:
 *            type: string
 *            description: ID of parent strategy
 *          name:
 *            type: string
 *            description: Strategy option name
 *          type:
 *            type: string
 *            description: Strategy option type
 *          description:
 *            type: string
 *            description: Strategy option description
 *          required:
 *            type: boolean
 *        example:
 *          name: name
 *          type: string
 *          description: some description
 *          required: true
 */

@Table
export class StratOptions extends Model<StratOptions> {

    @PrimaryKey
    @Column
    id!: string;

    @ForeignKey(() => Strategies)
    @Column
    strategyId!: string;

    @BelongsTo(() => Strategies, {onDelete: 'CASCADE', onUpdate: 'CASCADE', hooks: true})
    strategies!: Strategies;

    @Column
    name!: string;

    @Column
    type!: string;

    @Column
    description!: string;

    @Column
    required!: boolean;

    @CreatedAt
    @Column
    createdAt!: Date;

    @UpdatedAt
    @Column
    updatedAt!: Date;
}
