/**
 * Transit model definition and initialization.
 * This file defines the `Transit` model, which logs every attempt of a badge passing through a gate.
 * It tracks authorization status, used DPIs, and possible violations.
 */

import {
    Model,
    DataTypes,
    Sequelize,
    CreationOptional,
} from 'sequelize';
import { TransitStatus } from "../enum/transitStatus";
import { DPI } from "../enum/dpi";

/**
 * Interface defining the attributes of the Transit model.
 * @property {string} id - UUID of the transit event (primary key).
 * @property {string} gateId - UUID of the gate involved in the transit.
 * @property {string} badgeId - UUID of the badge used in the transit.
 * @property {TransitStatus} status - Status of the transit (authorized or unauthorized).
 * @property {string[]} usedDPIs - Array of DPI strings used during the transit.
 * @property {boolean} DPIviolation - Whether a DPI violation occurred.
 * @property {Date} [createdAt] - Timestamp of the transit creation.
 */
export interface TransitAttributes {
    id: string;
    gateId: string;
    badgeId: string;
    status: TransitStatus;
    usedDPIs: string[];
    DPIviolation: boolean;
    createdAt?: Date;
}

/**
 * Interface defining the attributes required to create a Transit instance.
 * @property {string} gateId - UUID of the gate involved.
 * @property {string} badgeId - UUID of the badge used.
 * @property {TransitStatus} status - Result of the access attempt.
 * @property {DPI[]} usedDPIs - DPIs provided during the transit.
 * @property {boolean} DPIviolation - Whether a violation occurred.
 * @property {Date} [createdAt] - Optional timestamp override (default: now).
 */
export interface TransitCreationAttributes {
    id?: string;
    gateId: string;
    badgeId: string;
    status: TransitStatus;
    usedDPIs: DPI[];
    DPIviolation: boolean;
    createdAt?: Date;
}

/**
 * Type representing updatable fields for a Transit.
 * Excludes immutable fields such as id, gateId, badgeId, and createdAt.
 */
export type TransitUpdateAttributes = Partial<Omit<TransitAttributes, 'id' | 'gateId' | 'badgeId' | 'createdAt'>>;

/**
 * Transit model class.
 * Represents an access attempt through a gate with a badge.
 * @extends Model<TransitAttributes,TransitCreationAttributes>
 * @implements TransitAttributes
 */
export class Transit extends Model<TransitAttributes, TransitCreationAttributes> implements TransitAttributes {
    /**
     * UUID of the transit record (auto-generated).
     */
    declare id: CreationOptional<string>;

    /**
     * UUID of the gate where the transit occurred.
     */
    declare gateId: string;

    /**
     * UUID of the badge used for the transit.
     */
    declare badgeId: string;

    /**
     * Authorization result of the transit.
     */
    declare status: TransitStatus;

    /**
     * Array of DPIs presented by the badge holder.
     */
    declare usedDPIs: CreationOptional<DPI[]>;

    /**
     * Whether a DPI requirement violation occurred.
     */
    declare DPIviolation: boolean;
}

/**
 * Initializes the Transit model.
 * @param {Sequelize} sequelize - Sequelize instance used for model initialization.
 */
export function InitTransitModel(sequelize: Sequelize) {
    Transit.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            gateId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'Gate',
                    key: 'id',
                }
            },
            badgeId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'Badge',
                    key: 'id',
                }
            },
            status: {
                type: DataTypes.ENUM(...Object.values(TransitStatus)),
                allowNull: false,
            },
            usedDPIs: {
                type: DataTypes.ARRAY(DataTypes.ENUM(...Object.values(DPI))),
                allowNull: true,
                defaultValue: [],
            },
            DPIviolation: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            }
        },
        {
            sequelize: sequelize,
            modelName: 'Transit',
            tableName: 'Transits',
            timestamps: true,
        }
    );
}
