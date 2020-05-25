import {Column, CreatedAt, ForeignKey, Model, PrimaryKey, Table, UpdatedAt} from "sequelize-typescript";
import {Consumers} from "./Consumers";

/**
 * @swagger
 *  components:
 *    schemas:
 *      Keys:
 *        type: object
 *        required:
 *          - keyHash
 *          - keyPrefix
 *          - name
 *          - throttling
 *          - throttlingRate
 *          - throttlingBurst
 *          - quota
 *          - quotaRate
 *          - quotaPeriod
 *          - activeFrom
 *          - activeTo
 *          - active
 *          - consumerId
 *        properties:
 *          keyHash:
 *            type: string
 *            description: key Hash.
 *          keyPrefix:
 *            type: string
 *            description: Key prefix to help identify keys.
 *          name:
 *            type: string
 *            description: visual name for keys.
 *          throttling:
 *            type: boolean
 *            description: throttling is active or not.
 *          throttlingRate:
 *            type: number
 *            description: throttling rate.
 *          throttlingBurst:
 *            type: number
 *            description: throttling allowed burst.
 *          quota:
 *            type: boolean
 *            description: quota is active or not.
 *          quotaRate:
 *            type: number
 *            description: quota rate.
 *          quotaPeriod:
 *            type: number
 *            description: quota allowed period.
 *          activeFrom:
 *            type: string
 *            description: Date time for active from.
 *          activeTo:
 *            type: string
 *            description: Date time for active from.
 *          active:
 *            type: boolean
 *            description: Key is active or not.
 *          consumerId:
 *            type: string
 *            description: Consumer ID.
 *        example:
 *          consumerId: 749104b8-cb0a-4222-b009-bbe3274a8a71
 *          name: a name
 */
@Table
export class Keys extends Model<Keys> {

    @PrimaryKey
    @Column
    id!: string;

    @Column
    keyHash!: string;

    @Column
    keyPrefix!: string;

    @Column
    name!: string;

    @Column
    throttling!: boolean;

    @Column
    throttlingRate!: number;

    @Column
    throttlingBurst!: number;

    @Column
    quota!: boolean;

    @Column
    quotaRate!: number;

    @Column
    quotaPeriod!: number;

    @Column
    activeFrom!: Date;

    @Column
    activeTo!: Date;

    @Column
    active!: boolean;

    @ForeignKey(() => Consumers)
    @Column
    consumerId!: string;

    @CreatedAt
    @Column
    createdAt!: Date;

    @UpdatedAt
    @Column
    updatedAt!: Date;
}
