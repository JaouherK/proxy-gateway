import {Column, CreatedAt, Model, PrimaryKey, Table, UpdatedAt} from "sequelize-typescript";

@Table
export class Configurations extends Model<Configurations> {

    @PrimaryKey
    @Column
    id!: string;

    @Column
    version!: number;

    @Column
    port!: string;

    @Column
    isDevelopment!: string;

    @Column
    allowedDomains!: string;

    @Column
    allowedHeaders!: string;

    @Column
    corsCredentials!: boolean;

    @Column
    methods!: string;

    @Column
    preflightContinue!: boolean;

    @Column
    jwtSecret!: string;

    @Column
    demoMode!: boolean;

    @Column
    timeout!: number;

    @Column
    timestampLogger!: boolean;

    @Column
    colorsOutput!: boolean;

    @Column
    activeSlowDown!: boolean;

    @Column
    windowMs!: number;

    @Column
    delayAfter!: number;

    @Column
    delayMs!: number;

    @Column
    maxDelayMs!: number;

    @Column
    enableHelmet!: boolean;

    @CreatedAt
    @Column
    createdAt!: Date;

    @UpdatedAt
    @Column
    updatedAt!: Date;
}
